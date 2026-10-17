from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.conf import settings


class CustomUserManager(BaseUserManager):
    """Custom user manager supporting email/phone/username creation."""
    def create_user(self, username=None, email=None, phone=None, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        
        # If username not provided, generate from email or phone
        if not username:
            base_name = email.split('@')[0]
            username = base_name
            count = 1
            while self.model.objects.filter(username=username).exists():
                username = f"{base_name}_{count}"
                count += 1
        
        extra_fields.setdefault("is_active", True)
        user = self.model(username=username, email=email, phone=phone, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, phone=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("role", "admin")

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(username=username, email=email, phone=phone, password=password, **extra_fields)


class CustomUser(AbstractUser):
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    )

    first_name = models.CharField(max_length=150, blank=False)
    last_name = models.CharField(max_length=150, blank=False)
    email = models.EmailField(unique=True, db_index=True)
    phone = models.CharField(max_length=20, unique=True, db_index=True)
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES, default='other')
    role = models.CharField(max_length=30, default='student')
    address = models.TextField(blank=True, default='')
    picture = models.ImageField(upload_to='profiles/', null=True, blank=True)
    
    # Password reset support
    reset_otp = models.CharField(max_length=6, null=True, blank=True)
    reset_otp_expires = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    REQUIRED_FIELDS = ['email', 'phone', 'first_name', 'last_name']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-date_joined']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"


class UserSession(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='session')
    refresh_token = models.TextField()
    refresh_jti = models.CharField(max_length=255, db_index=True)
    access_jti = models.CharField(max_length=255, db_index=True, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'User Session'
        verbose_name_plural = 'User Sessions'
        ordering = ['-updated_at']

    def __str__(self):
        return f"Session for {self.user.username} ({self.user.email})"
