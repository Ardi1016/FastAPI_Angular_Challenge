import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Course {
  id?: string;
  course_name: string;
  university: string;
  city: string;
  country: string;
  course_description: string;
  start_date: string;
  end_date: string;
  price: number;
  currency: string;
}

export interface CourseData {
  courseData: Course[];
  total: 0;
}

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private apiUrl = 'http://localhost:8000'; // Update this to match your FastAPI server URL

  constructor(private http: HttpClient) {}

  getCourses(
    skip: number = 0,
    limit: number = 10,
    search: string = ''
  ): Observable<CourseData> {
    let params = new HttpParams()
      .set('skip', skip.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<CourseData>(`${this.apiUrl}/courses`, { params });
  }

  createCourse(course: Course): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/courses`, course);
  }

  getCourse(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/courses/${id}`);
  }

  updateCourse(id: string, course: Partial<Course>): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/courses/${id}`, course);
  }

  deleteCourse(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/courses/${id}`);
  }
}
