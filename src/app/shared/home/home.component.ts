import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  images: string[] = [
    '../../../assets/images/home8.jpg',
    '../../../assets/images/home6.jpg',
    '../../../assets/images/home4.jpg',
    '../../../assets/images/home3.jpg',
  ];
  currentIndex: number = 0;

  ngOnInit(): void {
    this.startImageTransition();
  }
  startImageTransition(): void {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 2000); // 4 seconds per image
  }
}
