import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'status', 'actions'];
  isLoading = false;
  totalUsers = 0;
  pageSize = 10;
  currentPage = 1;
  searchTerm = '';

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers(this.currentPage, this.pageSize, this.searchTerm)
      .subscribe({
        next: (data) => {
          this.users = data.users;
          this.totalUsers = data.totalCount;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load users', err);
          alert(`Erro ao carregar usuários: ${err.message}`);
          this.isLoading = false;
        }
      });
  }

  onSearchChange(): void {
    this.currentPage = 1; // Reset to first page on new search
    this.loadUsers();
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1; // MatPaginator uses 0-based index
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  addUser(): void {
    this.router.navigate(['/users/new']);
  }

  editUser(id: number | undefined): void {
    if (id) {
      this.router.navigate([`/users/edit/${id}`]);
    }
  }

  deleteUser(id: number | undefined): void {
    if (id && confirm('Tem certeza que deseja excluir este usuário?')) {
      this.isLoading = true;
      this.userService.deleteUser(id).subscribe({
        next: () => {
          alert('Usuário excluído com sucesso!');
          this.loadUsers();
        },
        error: (err) => {
          console.error('Failed to delete user', err);
          alert(`Erro ao excluir usuário: ${err.message}`);
          this.isLoading = false;
        }
      });
    }
  }
}