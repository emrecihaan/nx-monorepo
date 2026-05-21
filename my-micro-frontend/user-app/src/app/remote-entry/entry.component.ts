import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TableModule } from 'primeng/table';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DatagridForFormatComponent, DataGridColumn } from '@my-micro-frontend/shared-ui';
import { UserService } from '../core/services/user.service';

interface User {
  id: number;
  userCode: string;
  userName: string;
  userSurname: string;
  gender: string;
  isActive: boolean;
  phoneNumber1: string;
  phoneNumber2: string;
  email: string;
}

interface Role {
  label: string;
  value: string;
}

interface Department {
  label: string;
  value: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    FloatLabelModule,
    FloatLabelModule,
    TableModule,
    DxDataGridModule,
    DatagridForFormatComponent
  ],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.scss'
})
export class RemoteEntryComponent implements OnInit {
  users: User[] = [];
  loading = true;  // Loading state for data fetching

  gridColumns: DataGridColumn[] = [
    { dataField: 'id', caption: 'ID', width: 70 },
    { dataField: 'userCode', caption: 'Kullanıcı Kodu', width: 120 },
    { dataField: 'userName', caption: 'Ad' },
    { dataField: 'userSurname', caption: 'Soyad' },
    { dataField: 'gender', caption: 'Cinsiyet', width: 100 },
    { dataField: 'isActive', caption: 'Aktif', dataType: 'boolean', width: 80 },
    { dataField: 'phoneNumber1', caption: 'Telefon 1', width: 140 },
    { dataField: 'phoneNumber2', caption: 'Telefon 2', width: 140 },
    { dataField: 'email', caption: 'E-posta' }
  ];

  // Form fields
  newUser = {
    userCode: '',
    userName: '',
    userSurname: '',
    email: '',
    phoneNumber1: '',
    phoneNumber2: '',
    gender: '',
    isActive: true
  };

  roles: Role[] = [
    { label: 'Admin', value: 'admin' },
    { label: 'Manager', value: 'manager' },
    { label: 'Developer', value: 'developer' },
    { label: 'Designer', value: 'designer' },
    { label: 'User', value: 'user' }
  ];

  departments: Department[] = [
    { label: 'Engineering', value: 'engineering' },
    { label: 'Design', value: 'design' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Sales', value: 'sales' },
    { label: 'HR', value: 'hr' },
    { label: 'Finance', value: 'finance' }
  ];

  constructor(
    private translate: TranslateService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {
    // Manually initialize translation for micro-frontend
    this.translate.setDefaultLang('tr');
    this.translate.use('tr');
  }



  ngOnInit() {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        this.users = response;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addUser() {
    if (!this.newUser.userName || !this.newUser.userSurname || !this.newUser.email || !this.newUser.userCode) {
      console.warn('Lütfen tüm zorunlu alanları doldurun!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newUser.email)) {
      console.error('Geçerli bir email adresi girin!');
      return;
    }

    const user: User = {
      id: this.users.length + 1,
      userCode: this.newUser.userCode,
      userName: this.newUser.userName,
      userSurname: this.newUser.userSurname,
      email: this.newUser.email,
      phoneNumber1: this.newUser.phoneNumber1,
      phoneNumber2: this.newUser.phoneNumber2,
      gender: this.newUser.gender,
      isActive: this.newUser.isActive
    };

    this.users = [user, ...this.users];

    this.resetForm();
  }

  resetForm() {
    this.newUser = {
      userCode: '',
      userName: '',
      userSurname: '',
      email: '',
      phoneNumber1: '',
      phoneNumber2: '',
      gender: '',
      isActive: true
    };
  }

  deleteUser(user: User) {
    this.users = this.users.filter(u => u.id !== user.id);
    console.info(`${user.userName} ${user.userSurname} kullanıcısı silindi`);
  }
}
