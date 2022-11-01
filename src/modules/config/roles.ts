export class Roles {
  private readonly allRoles: { [key: string]: string[] };

  constructor() {
    this.allRoles = {
      user: [],
      admin: ['getUsers', 'manageUsers'],
    }
  }

  getRoles(): string[] {
    return Object.keys(this.allRoles);
  }

  getRoleRights(): object {
    const roleRights = new Map(Object.entries(this.allRoles));
    return roleRights;
  }
}
