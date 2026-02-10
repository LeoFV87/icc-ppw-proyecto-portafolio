import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule.html'
})
export class Schedule implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/schedules';

  selectedDay = signal('Lunes');
  selectedTime = signal('');
  mySlots = signal<string[]>([]);

  ngOnInit() {
    this.loadSlots();
  }

  loadSlots() {
    this.http.get<string[]>(`${this.apiUrl}/my-slots`).subscribe(slots => {
      this.mySlots.set(slots);
    });
  }

  async addSlot() {
    if (!this.selectedTime()) return;
    const newSlot = `${this.selectedDay()} - ${this.selectedTime()}`;

    if (this.mySlots().includes(newSlot)) return alert('Ya existe');

    this.http.post(this.apiUrl, { slot: newSlot }).subscribe({
      next: () => {
        this.mySlots.update(s => [...s, newSlot]);
        alert('✅ Horario guardado en Java');
      }
    });
  }

  async removeSlot(slot: string) {
    this.http.delete(`${this.apiUrl}?slot=${encodeURIComponent(slot)}`).subscribe({
      next: () => {
        this.mySlots.update(s => s.filter(i => i !== slot));
      }
    });
  }
}
