import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { HolidayService, Holiday } from '../holiday.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('monthName') monthName!: ElementRef;
  @ViewChild('monthDates') monthDates!: ElementRef;

  currentDate = new Date();
  feriados: Holiday[] = [];

  constructor(private holidayService: HolidayService) {}

  ngOnInit() {
    this.loadHolidays(this.currentDate.getFullYear());
  }

 ngAfterViewInit() {
  this.updateCalendar();

  this.monthDates.nativeElement.addEventListener('click', (event: any) => {
    const target = event.target.closest('.date');
    if (!target || !target.dataset.date) return;

    const clickedDate = target.dataset.date;
    const holiday = this.feriados.find(f => f.date === clickedDate);

    const modal = document.getElementById('holidayModal')!;
    const text = document.getElementById('holidayText')!;
    const close = document.getElementById('closeModal')!;

    if (holiday) {
      text.textContent = `⭐ ${holiday.name}`;
    } else {
      text.textContent = `Sem feriado em ${clickedDate}`;
    }

    modal.style.display = 'block';

    close.onclick = () => {
      modal.style.display = 'none';
    };

    window.onclick = (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    };
  });
}


  loadHolidays(year: number) {
    this.holidayService.getHolidays(year).subscribe((feriados) => {
      this.feriados = feriados;
      this.updateCalendar();
    });
  }

  updateCalendar = () => {
    const currentYear = this.currentDate.getFullYear();
    const currentMonth = this.currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 0);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();

    const monthNameString = this.currentDate.toLocaleDateString('default', {
      month: 'long',
      year: 'numeric',
    });
    this.monthName.nativeElement.textContent = monthNameString;

    let datesHTML = '';


    for (let i = firstDayIndex; i > 0; i--) {
      const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
      datesHTML += `<div class="date inactive">${prevDate.getDate()}</div>`;
    }

    for (let i = 1; i <= totalDays; i++) {
    const date = new Date(currentYear, currentMonth, i);
    const iso = date.toISOString().split('T')[0];
    const holiday = this.feriados.find(f => f.date === iso);
    const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';
    const holidayClass = holiday ? 'holiday' : '';
    const star = holiday ? '⭐' : '';

    datesHTML += `<div class="date ${activeClass} ${holidayClass}" data-date="${iso}">${i} ${star}</div>`;
  }


    for (let i = 1; i <= 7 - lastDayIndex; i++) {
      const nextDate = new Date(currentYear, currentMonth + 1, i);
      datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
    }

    this.monthDates.nativeElement.innerHTML = datesHTML;
  };

  goToPreviousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.loadHolidays(this.currentDate.getFullYear());
  }

  goToNextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.loadHolidays(this.currentDate.getFullYear());
  }
}
