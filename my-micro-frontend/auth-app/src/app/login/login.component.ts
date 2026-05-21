import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
    imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, FloatLabelModule, ToastModule, TranslateModule],
    providers: [MessageService],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    username = '';
    password = '';
    loading = false;

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
                detail: this.translate.instant('LOGIN.REQUIRED_FIELDS'),
                life: 3000
            });
            return;
        }

        this.loading = true;

        this.loginService.login(this.username, this.password, 1).subscribe({
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
