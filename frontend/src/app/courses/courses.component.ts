import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CourseService, Course, CourseData } from '../course.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  displayedColumns: string[] = [
    'course_name',
    'location',
    'start',
    'length',
    'price',
  ];
  dataSource = new MatTableDataSource<Course>([]);
  course = <Course>{};
  totalCourses = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  searchTerm = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(event?: PageEvent) {
    const skip = event ? event.pageIndex * event.pageSize : 0;
    const limit = event ? event.pageSize : this.pageSize;

    this.courseService.getCourses(skip, limit, this.searchTerm).subscribe(
      (courseData: CourseData) => {
        this.dataSource.data = courseData.courseData;
        this.totalCourses = courseData.total; // This should be updated to use the total count from the API
      },
      (error) => console.error('Error loading courses:', error)
    );
  }

  getCourse(id: string) {
    this.courseService.getCourse(id).subscribe(
      (course: Course) => {
        this.course = course;
      },
      (error) => console.error('Error loading courses:', error)
    );
  }

  onSearch() {
    this.loadCourses();
  }

  deleteCourse(id: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      this.courseService.deleteCourse(id).subscribe(
        () => this.loadCourses(),
        (error) => console.error('Error deleting course:', error)
      );
    }
  }

  calculateLength(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  formatPrice(price: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  }
}
