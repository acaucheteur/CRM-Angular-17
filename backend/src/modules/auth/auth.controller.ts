import { Controller, Post, UseGuards, Request, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Connexion utilisateur' })
  @ApiResponse({ status: 200, description: 'Authentification réussie' })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  async login(@Request() req, @Body() loginDto: { email: string; password: string }) {
    return this.authService.login(req.user);
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Déconnexion utilisateur' })
  async logout() {
    return { message: 'Déconnexion réussie' };
  }
}
