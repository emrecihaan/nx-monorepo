import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { LoginService, TokenService } from '@my-micro-frontend/shared-core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, FloatLabelModule, ToastModule, TranslateModule, RouterModule],
    providers: [MessageService],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewInit {
    username = '';
    password = '';
    captchaInput = '';
    captchaText = '';
    loading = false;

    @ViewChild('captchaCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

    private loginService = inject(LoginService);
    private tokenService = inject(TokenService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private translate = inject(TranslateService);

    ngOnInit(): void {
        this.translate.onLangChange.subscribe(() => {
            // Language changed
        });

        if (this.tokenService.isAuthenticated()) {
            this.router.navigate(['/app']);
        }
    }

    ngAfterViewInit(): void {
        this.generateCaptcha();
    }

    generateCaptcha() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz123456789';
        let length = 6;
        this.captchaText = '';
        for (let i = 0; i < length; i++) {
            this.captchaText += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        this.drawCaptcha();
    }

    drawCaptcha() {
        if (!this.canvasRef || !this.canvasRef.nativeElement) return;
        const canvas = this.canvasRef.nativeElement;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#fafafa'; // Very light gray/white background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const lineColors = ['#a7d2cb', '#f4a261', '#e76f51', '#2a9d8f', '#e9c46a', '#c8b6ff', '#b5e48c'];
        const textColors = ['#264653', '#2a9d8f', '#85182a', '#5f0f40', '#312244', '#003049', '#4b5320', '#4a3b32', '#3c096c', '#001d3d'];

        for (let i = 0; i < 4; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.strokeStyle = lineColors[Math.floor(Math.random() * lineColors.length)];
            ctx.lineWidth = Math.random() * 1.5 + 0.5;
            ctx.stroke();
        }

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const padding = 30; // Sol ve sağdan boşluk
        const availableWidth = canvas.width - (padding * 2);
        const spacing = availableWidth / (this.captchaText.length - 1);

        for (let i = 0; i < this.captchaText.length; i++) {
            ctx.save();
            const fontSize = Math.floor(Math.random() * 8 + 32); // 32 to 40px
            ctx.font = `normal ${fontSize}px Arial, sans-serif`;
            ctx.fillStyle = textColors[Math.floor(Math.random() * textColors.length)];

            const x = padding + (i * spacing);
            const y = canvas.height / 2;

            ctx.translate(x, y + (Math.random() * 6 - 3));
            const rotation = (Math.random() - 0.5) * 0.5; // -0.25 to 0.25 rad
            ctx.rotate(rotation);
            ctx.fillText(this.captchaText[i], 0, 0);
            ctx.restore();
        }
    }

    switchLanguage(lang: string) {
        this.translate.use(lang);
    }

    get currentLang(): string {
        return this.translate.currentLang || 'tr';
    }

    login() {
        if (!this.username || !this.password) {
            this.messageService.add({
                severity: 'warn',
                summary: this.translate.instant('LOGIN.WARNING'),
                detail: this.translate.instant('LOGIN.REQUIRED_FIELDS') || 'Lütfen kullanıcı adı ve şifrenizi giriniz.',
                life: 3000
            });
            return;
        }

        if (!this.captchaInput) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Uyarı',
                detail: 'Lütfen güvenlik kodunu giriniz.',
                life: 3000
            });
            return;
        }

        if (this.captchaInput.toLowerCase() !== this.captchaText.toLowerCase()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Hata',
                detail: 'Güvenlik kodunu hatalı girdiniz.',
                life: 3000
            });
            this.generateCaptcha();
            this.captchaInput = '';
            return;
        }

        this.loading = true;

        this.loginService.login(this.username, this.password, 2010).subscribe({
            next: (response) => {
                this.loading = false;
                if (response && response.code === '00' && response.response) {
                    // Extract the actual JWT token from the response
                    this.tokenService.setToken(response.response);
                    this.messageService.add({
                        severity: 'success',
                        summary: this.translate.instant('LOGIN.SUCCESS'),
                        detail: this.translate.instant('LOGIN.LOGIN_SUCCESS'),
                        life: 3000
                    });
                    setTimeout(() => {
                        this.router.navigate(['/app']);
                    }, 1000);
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: this.translate.instant('LOGIN.ERROR'),
                        detail: this.translate.instant('LOGIN.TOKEN_ERROR'),
                        life: 3000
                    });
                }
            },
            error: (err) => {
                this.loading = false;
                console.error('Login error', err);
                this.messageService.add({
                    severity: 'error',
                    summary: this.translate.instant('LOGIN.ERROR'),
                    detail: this.translate.instant('LOGIN.LOGIN_FAILED'),
                    life: 3000
                });
            },
        });
    }
}
