import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Country, City, IState } from 'country-state-city';
import { CourseService, Course } from '../course.service';
import axios from 'axios';

interface ICountry {
  name: string;
  isoCode: string;
}

interface IUniversity {
  country: string;
  name: string;
}

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatAutocompleteModule,
  ],
  templateUrl: './course-form.component.html',
  styleUrls: ['./course-form.component.scss'],
})
export class CourseFormComponent implements OnInit {
  courseForm: FormGroup;
  filteredCountries: Observable<string[]> | undefined;
  filteredCities: Observable<string[]> | undefined;
  filteredUniversities: Observable<string[]> | undefined;

  countries: ICountry[] = Country.getAllCountries();
  cities: string[] = [];
  universities: IUniversity[] = [];
  isEditMode = false;
  isEditValid = false;
  courseId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.courseForm = this.fb.group({
      course_name: ['', Validators.required],
      university: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      course_description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      currency: ['', Validators.required],
    });
  }

  async init() {
    this.universities = await this.allUniversities();
  }

  ngOnInit(): void {
    this.init();

    this.filteredCountries = this.courseForm.get('country')!.valueChanges.pipe(
      startWith(''),
      map((value) =>
        this._filterCountries(value).map((country) => country.name)
      )
    );

    this.courseForm.get('country')!.valueChanges.subscribe((countryName) => {
      const country: ICountry | undefined = this.countries.find(
        (value) => value.name === countryName
      );
      if (country) {
        const citiesOfState = City.getCitiesOfCountry(country.isoCode);
        this.cities = citiesOfState
          ? citiesOfState.map((city) => city.name)
          : [];
        this.courseForm.get('city')!.setValue('');
      }
    });

    this.filteredCities = this.courseForm.get('city')!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterCities(value))
    );

    this.filteredUniversities = this.courseForm
      .get('university')!
      .valueChanges.pipe(
        startWith(''),
        map((value) =>
          this._filterUniversities(value).map((university) => university.name)
        )
      );

    this.courseForm
      .get('university')!
      .valueChanges.subscribe((universityName) => {
        const university = this.universities.find(
          (value) => value.name === universityName
        );
        if (university) {
          this.courseForm.get('country')!.setValue(university.country);
        }
      });

    this.courseId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.courseId;

    if (this.isEditMode && this.courseId) {
      // Load course data for editing
      this.courseService.getCourse(this.courseId).subscribe(
        (course: Course) => {
          this.courseForm.patchValue(course);
        },
        (error) => console.error('Error loading course:', error)
      );
    }
  }

  private _filterCountries(value: string): ICountry[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter((country) =>
      country.name.toLowerCase().includes(filterValue)
    );
  }

  private _filterCities(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.cities.filter((city) =>
      city.toLowerCase().includes(filterValue)
    );
  }

  private _filterUniversities(value: string): IUniversity[] {
    const filterValue = value.toLowerCase();
    return this.universities.filter((university) =>
      university.name.toLowerCase().includes(filterValue)
    );
  }

  async allUniversities(): Promise<IUniversity[]> {
    const response = await axios.get(`http://universities.hipolabs.com/search`);
    return response.data;
  }

  onSubmit() {
    const courseData: Course = this.courseForm.value;

    courseData.start_date = this.formatDate(courseData.start_date);
    courseData.end_date = this.formatDate(courseData.end_date);

    if (this.isEditMode && this.courseId) {
      this.courseService.updateCourse(this.courseId, courseData).subscribe(
        () => this.router.navigate(['/courses']),
        (error) => console.error('Error updating course:', error)
      );
    } else {
      this.courseService.createCourse(courseData).subscribe(
        () => this.router.navigate(['/courses']),
        (error) => console.error('Error creating course:', error)
      );
    }
  }

  formatDate(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }
}
