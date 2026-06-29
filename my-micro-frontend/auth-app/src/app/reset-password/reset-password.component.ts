import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LoginService } from '@my-micro-frontend/shared-core';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PasswordModule, ButtonModule, FloatLabelModule, ToastModule, TranslateModule],
  providers: [MessageService],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  password: string = '';
  loading: boolean = false;
  currentLang: string = 'tr';

  private router = inject(Router);
  private messageService = inject(MessageService);
  private translate = inject(TranslateService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);

  token: any | null = null;
  isTokenValid = false;
  isLoading = true;

  // Yeni şifre formu
  resetForm = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  constructor() {
    this.currentLang = this.translate.currentLang || 'tr';
  }
  ngOnInit(): void {
    // 1. URL'deki token parametresini oku
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      this.isLoading = false;
      alert('Geçersiz veya eksik token!');
      this.router.navigate(['/auth/login']);
      return;
    }

    // 2. Güvenlik için URL'deki token'ı temizle (Tarayıcı geçmişinde kalmasın)
    this.router.navigate([], {
      queryParams: { token: null },
      queryParamsHandling: 'merge'
    });

    // 3. Token'ın geçerli olup olmadığını Backend'e sor
    this.verifyToken(this.token);
  }

  verifyToken(token: string) {
    this.loginService.verifyToken(this.token).subscribe({
      next: (response) => {
        this.isTokenValid = true;
        this.isLoading = false;
      },
      error: () => {
        alert('Şifre sıfırlama linkinin süresi dolmuş veya geçersiz.');
        this.router.navigate(['/auth/login']);
      }
    });
  }
  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    const password = this.resetForm.value.password;
    const confirmPassword = this.resetForm.value.confirmPassword;

    if (password !== confirmPassword) {
      this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Şifreler uyuşmuyor!' });
      return;
    }

    this.loading = true;

    // 4. Yeni şifreyi backend'e gönder
    this.loginService.resetPassword(this.token, password as string).subscribe({
      next: () => {
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Başarılı', detail: 'Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.' });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({ severity: 'error', summary: 'Hata', detail: 'Şifre güncellenirken bir hata oluştu.' });
      }
    });
  }

  goBack() {
    this.router.navigate(['/login']);
  }
}
