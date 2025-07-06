import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService, User, CreateUserRequest, UpdateUserRequest } from '../../../../shared/services/user.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = false;
  displayDialog = false;
  displayEditDialog = false;
  isEditMode = false;
  selectedUser: User | null = null;
  searchTerm: string = '';

  // Stats
  totalUsers: number = 0;
  totalAdmins: number = 0;
  totalRegularUsers: number = 0;
  
  userForm: FormGroup;
  editUserForm: FormGroup;
  
  roles = [
    { label: 'Admin', value: 'ADMIN' },
    { label: 'User', value: 'USER' }
  ];

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.userForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: [''],
      userRoles: ['USER', [Validators.required]]
    });

    this.editUserForm = this.fb.group({
      id: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      role: ['USER', [Validators.required]],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.filteredUsers = data;
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
        this.loading = false;
      }
    });
  }

  onSearch(event: any) {
    const value = event.target.value.toLowerCase();
    this.searchTerm = value;
    this.filteredUsers = this.users.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      (user.phoneNumber || '').toLowerCase().includes(value) ||
      (user.role || '').toLowerCase().includes(value)
    );
  }

  calculateStats() {
    this.totalUsers = this.users.length;
    this.totalAdmins = this.users.filter(u => u.role === 'ADMIN').length;
    this.totalRegularUsers = this.users.filter(u => u.role === 'USER').length;
  }

  showCreateDialog() {
    this.isEditMode = false;
    this.userForm.reset({
      userRoles: 'USER'
    });
    this.displayDialog = true;
  }

  showEditDialog(user: User) {
    this.isEditMode = true;
    this.selectedUser = user;
    this.editUserForm.patchValue({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      role: user.role,
      password: ''
    });
    this.displayEditDialog = true;
  }

  createUser() {
    if (this.userForm.valid) {
      const userData: CreateUserRequest = this.userForm.value;
      this.loading = true;
      
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User created successfully'
          });
          this.displayDialog = false;
          this.loadUsers();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to create user'
          });
          this.loading = false;
        }
      });
    }
  }

  updateUser() {
    if (this.editUserForm.valid) {
      const userData: UpdateUserRequest = this.editUserForm.value;
      this.loading = true;
      
      this.userService.updateUser(userData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User updated successfully'
          });
          this.displayEditDialog = false;
          this.loadUsers();
          this.loading = false;
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to update user'
          });
          this.loading = false;
        }
      });
    }
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete ${user.firstName} ${user.lastName}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.loading = true;
        this.userService.deleteUser(user.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'User deleted successfully'
            });
            this.loadUsers();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error deleting user:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete user'
            });
            this.loading = false;
          }
        });
      }
    });
  }

  cancelDialog() {
    this.displayDialog = false;
    this.displayEditDialog = false;
    this.userForm.reset();
    this.editUserForm.reset();
  }
} 