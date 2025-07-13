import { Component, ElementRef, ViewChild } from '@angular/core';


@Component({
  selector: 'app-calendar',
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent {
  @ViewChild('monthName') monthName!:ElementRef;
  @ViewChild('monthDates') monthDates!:ElementRef;
  @ViewChild('prevBtn') prevBtn!:ElementRef;
  @ViewChild('nextBtn') nextBtn!:ElementRef;

  currentDate = new Date();

  ngAfterViewInit() {
    this.updateCalendar();
  }

  updateCalendar = () => {
    const currentYear = this.currentDate.getFullYear();
    const currentMonth = this.currentDate.getMonth();

    const firstDay = new Date(currentYear, currentMonth, 0)
    const lastDay = new Date(currentYear, currentMonth + 1, 0)
    const totalDays = lastDay.getDate();
    const firstDayIndex = firstDay.getDay();
    const lastDayIndex = lastDay.getDay();

    const monthNameString = this.currentDate.toLocaleDateString('default', {month: "long", year: "numeric"});
    this.monthName.nativeElement.textContent = monthNameString;

    let datesHTML = '';

    for (let i = firstDayIndex; i > 0; i--) {
      const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
      datesHTML += `<div class="date inactive">${prevDate.getDate()}</div>`
    }

    for (let i = 1; i <= totalDays; i ++) {
      const date = new Date(currentYear, currentMonth, i);
      const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';

      datesHTML += `<div class="date ${activeClass}">${i}</div>`
    }

    for (let i = 1; i <= 7 - lastDayIndex; i++) {
      const nextDate = new Date(currentYear, currentMonth + 1, i);
      datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
    }

    this.monthDates.nativeElement.innerHTML = datesHTML;
  }

  goToPreviousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.updateCalendar()

  }

  goToNextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.updateCalendar()
  }

}
