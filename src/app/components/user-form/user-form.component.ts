import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  isLoading = false;
  passwordVisible = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      status: ['active', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    if (this.userId) {
      this.isEditMode = true;
      this.userForm.get('password')?.setValidators([]); // Password is not required for edit, unless changed
      this.userForm.get('password')?.updateValueAndValidity();
      this.loadUser(this.userId);
    }
  }

  loadUser(id: number): void {
    this.isLoading = true;
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user', err);
        alert(`Erro ao carregar usuário para edição: ${err.message}`);
        this.isLoading = false;
        this.router.navigate(['/users']);
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      alert('Por favor, preencha todos os campos obrigatórios e válidos.');
      return;
    }

    this.isLoading = true;
    const user: User = this.userForm.value;

    if (this.isEditMode && this.userId) {
      // For edit, remove password if not changed
      if (!user.password) {
        delete user.password;
      }
      this.userService.updateUser(this.userId, user).subscribe({
        next: () => {
          alert('Usuário atualizado com sucesso!');
          this.router.navigate(['/users']);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to update user', err);
          alert(`Erro ao atualizar usuário: ${err.message}`);
          this.isLoading = false;
        }
      });
    } else {
      this.userService.createUser(user).subscribe({
        next: () => {
          alert('Usuário criado com sucesso!');
          this.router.navigate(['/users']);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to create user', err);
          alert(`Erro ao criar usuário: ${err.message}`);
          this.isLoading = false;
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}