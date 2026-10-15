import { ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonText
} from '@ionic/angular';
import { Motion } from '@capacitor/motion';
import type { PluginListenerHandle } from '@capacitor/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonText
  ]
})
export class HomePage implements OnDestroy {
  ballX = 50;
  ballY = 50;
  accelerationX = 0;
  accelerationY = 0;
  movement = 'Waiting for movement';
  isMonitoring = false;
  errorMessage = '';

  private motionHandle?: PluginListenerHandle;
  private cdr = inject(ChangeDetectorRef);

  async startMonitoring() {
    if (this.isMonitoring) {
      return;
    }

    this.errorMessage = '';

    try {
      // iOS may require permission after a user action.
      const motionPermission =
        typeof DeviceMotionEvent !== 'undefined'
          ? (DeviceMotionEvent as any).requestPermission
          : undefined;

      if (typeof motionPermission === 'function') {
        const permission = await motionPermission.call(DeviceMotionEvent);

        if (permission !== 'granted') {
          this.errorMessage = 'Motion sensor permission was not granted.';
          this.cdr.detectChanges();
          return;
        }
      }

      this.motionHandle = await Motion.addListener('accel', (event) => {
        const acceleration =
          event.accelerationIncludingGravity ?? event.acceleration;

        if (!acceleration) {
          return;
        }

        this.accelerationX = acceleration.x ?? 0;
        this.accelerationY = acceleration.y ?? 0;

        // Change ball position using sensor values.
        this.ballX = this.clamp(this.ballX + this.accelerationX * 0.8, 5, 95);
        this.ballY = this.clamp(this.ballY - this.accelerationY * 0.8, 5, 95);

        this.updateMovement();
        this.cdr.detectChanges();
      });

      this.isMonitoring = true;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Motion sensor error:', error);
      this.errorMessage =
        'Unable to access motion sensors. Check device support and permissions.';
      this.cdr.detectChanges();
    }
  }

  async stopMonitoring() {
    await this.motionHandle?.remove();
    this.motionHandle = undefined;
    this.isMonitoring = false;
    this.movement = 'Sensor stopped';
    this.cdr.detectChanges();
  }

  resetBall() {
    this.ballX = 50;
    this.ballY = 50;
    this.movement = 'Ball reset';
    this.cdr.detectChanges();
  }

  private updateMovement() {
    const threshold = 1.5;

    if (Math.abs(this.accelerationX) > threshold) {
      this.movement = this.accelerationX > 0 ? 'Moving right' : 'Moving left';
    } else if (Math.abs(this.accelerationY) > threshold) {
      this.movement = this.accelerationY > 0 ? 'Moving up' : 'Moving down';
    } else {
      this.movement = 'Stable';
    }
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  }

  async ngOnDestroy() {
    await this.motionHandle?.remove();
  }
}