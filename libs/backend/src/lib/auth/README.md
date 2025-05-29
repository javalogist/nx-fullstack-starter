# Auth Module

A flexible and feature-rich authentication module for NestJS applications. This module provides a complete authentication solution with support for multiple strategies (JWT, Local, Google OAuth) and role-based authorization.

## Features

- 🔐 Multiple Authentication Strategies
  - JWT-based authentication
  - Local (email/password) authentication
  - Google OAuth authentication
- 👥 Role-based Authorization
- 🔑 Token Management
- 🔄 Extensible Architecture
- 🛡️ Type Safety

## Installation

```bash
npm install @nx-fullstack-starter/backend
```

## Quick Start

1. Import the AuthModule in your application:

```typescript
import { AuthModule } from '@nx-fullstack-starter/backend';

@Module({
  imports: [
    AuthModule.forRoot({
      strategies: {
        jwt: true,      // Enable JWT authentication
        local: true,    // Enable local authentication
        google: true,   // Enable Google OAuth
      },
      userService: {
        provide: 'YOUR_USER_SERVICE',
        useClass: YourUserService,
      },
    }),
  ],
})
export class AppModule {}
```

2. Create a User Service implementing `IUserService`:

```typescript
import { Injectable } from '@nestjs/common';
import { IUserService, IBaseUser } from '@nx-fullstack-starter/backend';

@Injectable()
export class YourUserService implements IUserService {
  async findById(id: string): Promise<IBaseUser> {
    // Implement user lookup by ID
  }

  async findByEmail(email: string): Promise<IBaseUser> {
    // Implement user lookup by email
  }

  async validatePassword(user: IBaseUser, password: string): Promise<boolean> {
    // Implement password validation
  }

  // ... implement other required methods
}
```

## Authentication Strategies

### JWT Authentication

```typescript
@Controller('auth')
export class AuthController {
  constructor(private authService: IAuthService) {}

  @Post('login')
  async login(@Body() credentials: LoginDto) {
    const user = await this.authService.validateUser(
      credentials.email,
      credentials.password
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    const token = await this.authService.generateToken(user);
    return { user, token };
  }
}
```

### Local Authentication

```typescript
@Controller('auth')
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    const token = await this.authService.generateToken(req.user);
    return { user: req.user, token };
  }
}
```

### Google OAuth

```typescript
@Controller('auth')
export class AuthController {
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Request() req) {
    const token = await this.authService.generateToken(req.user);
    return { user: req.user, token };
  }
}
```

## Role-based Authorization

1. Use the `@Roles()` decorator to protect routes:

```typescript
@Controller('users')
export class UsersController {
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async getAllUsers() {
    // Only admins can access this endpoint
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: IBaseUser) {
    // Any authenticated user can access this endpoint
  }
}
```

2. Access the current user in your controllers:

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)
async getProfile(@CurrentUser() user: IBaseUser) {
  return user;
}
```

## Environment Variables

Configure the following environment variables:

```env
# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_AUDIENCE=your-audience

# Google OAuth (if using Google strategy)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
```

## Custom Implementation

You can provide your own implementation of `IAuthService`:

```typescript
@Module({
  imports: [
    AuthModule.forRoot({
      strategies: {
        jwt: true,
      },
      userService: {
        provide: 'YOUR_USER_SERVICE',
        useClass: YourUserService,
      },
      authService: {
        provide: AUTH_SERVICE,
        useClass: YourCustomAuthService,
      },
    }),
  ],
})
export class AppModule {}
```

## Available Guards

- `JwtAuthGuard`: Protects routes requiring JWT authentication
- `LocalAuthGuard`: Protects routes requiring local authentication
- `GoogleAuthGuard`: Protects routes requiring Google OAuth
- `RolesGuard`: Protects routes based on user roles

## Available Decorators

- `@CurrentUser()`: Get the current authenticated user
- `@Roles()`: Specify required roles for a route

## Type Definitions

```typescript
 interface IBaseUser {
    id: string;
    googleId?:string|null;
    email: string;
    password: string;
    firstName:string;
    middleName?:string|null;
    lastName:string;
    username?: string|null;
    profilePicture?:string|null;
    roles: string[];
    loginType: LoginType;
    createdAt: Date;
    updatedAt: Date;
}

enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}
```

## Error Handling

The module throws standard NestJS HTTP exceptions:

- `UnauthorizedException`: When authentication fails
- `ForbiddenException`: When role-based access is denied

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 