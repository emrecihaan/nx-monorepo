import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoginService } from '@my-micro-frontend/shared-core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, FloatLabelModule, ToastModule, TranslateModule],
  providers: [MessageService],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: string = '';
  loading: boolean = false;
  currentLang: string = 'tr';

  private router = inject(Router);
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);
  private loginService = inject(LoginService);

  constructor() {
    this.currentLang = this.translate.currentLang || 'tr';
  }

  switchLanguage(lang: string) {
    this.currentLang = lang;
    this.translate.use(lang);
  }

  sendVerification() {
    if (!this.email) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Uyarı',
        detail: 'Lütfen email adresinizi giriniz.'
      });
      return;
    }

    this.loading = true;

    this.loginService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.loading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Başarılı',
          detail: 'Doğrulama bağlantısı email adresinize gönderildi.'
        });

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Hata',
          detail: 'Doğrulama bağlantısı gönderilirken bir hata oluştu.'
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
