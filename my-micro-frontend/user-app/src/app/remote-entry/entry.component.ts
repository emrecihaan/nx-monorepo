import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TranslateModule } from '@ngx-translate/core';
import { DatagridForFormatComponent } from '@my-micro-frontend/shared-ui';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: string;
  joinDate: string;
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
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    Select,
    TagModule,
    ToastModule,
    TranslateModule,
    DatagridForFormatComponent
  ],
  providers: [MessageService],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.scss'
})
export class RemoteEntryComponent implements OnInit {
  users: User[] = [];

  // Form fields
  newUser = {
    name: '',
    email: '',
    role: '',
    department: '',
    status: 'active'
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

  constructor(private messageService: MessageService) { }

  gridColumns = [
    { dataField: 'id', caption: 'ID', width: 70 },
    { dataField: 'name', caption: 'Ad Soyad' },
    { dataField: 'email', caption: 'Email' },
    { dataField: 'role', caption: 'Rol' },
    { dataField: 'department', caption: 'Departman' },
    { dataField: 'status', caption: 'Durum' },
    { dataField: 'joinDate', caption: 'Katılma Tarihi', dataType: 'date' }
  ];

  ngOnInit() {
    // Sample data
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@company.com',
        role: 'admin',
        department: 'engineering',
        status: 'active',
        joinDate: '2024-01-15'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@company.com',
        role: 'manager',
        department: 'design',
        status: 'active',
        joinDate: '2024-02-20'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        role: 'developer',
        department: 'engineering',
        status: 'active',
        joinDate: '2024-03-10'
      },
      {
        id: 4,
        name: 'Sarah Williams',
        email: 'sarah.williams@company.com',
        role: 'designer',
        department: 'design',
        status: 'inactive',
        joinDate: '2023-12-05'
      }
    ];
  }

  addUser() {
    // Validation
    if (!this.newUser.name || !this.newUser.email || !this.newUser.role || !this.newUser.department) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Uyarı',
        detail: 'Lütfen tüm alanları doldurun!'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.newUser.email)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Hata',
        detail: 'Geçerli bir email adresi girin!'
      });
      return;
    }

    // Create new user
    const user: User = {
      id: this.users.length + 1,
      name: this.newUser.name,
      email: this.newUser.email,
      role: this.newUser.role,
      department: this.newUser.department,
      status: this.newUser.status,
      joinDate: new Date().toISOString().split('T')[0]
    };

    // Add to table
    this.users = [user, ...this.users];

    // Show success message
    this.messageService.add({
      severity: 'success',
      summary: 'Başarılı',
      detail: 'Kullanıcı başarıyla eklendi!'
    });

    // Reset form
    this.resetForm();
  }

  resetForm() {
    this.newUser = {
      name: '',
      email: '',
      role: '',
      department: '',
      status: 'active'
    };
  }

  deleteUser(user: User) {
    this.users = this.users.filter(u => u.id !== user.id);
    this.messageService.add({
      severity: 'info',
      summary: 'Silindi',
      detail: `${user.name} kullanıcısı silindi`
    });
  }

  getRoleLabel(role: string): string {
    const roleObj = this.roles.find(r => r.value === role);
    return roleObj ? roleObj.label : role;
  }

  getDepartmentLabel(department: string): string {
    const deptObj = this.departments.find(d => d.value === department);
    return deptObj ? deptObj.label : department;
  }

  getStatusSeverity(status: string): 'success' | 'danger' {
    return status === 'active' ? 'success' : 'danger';
  }
}