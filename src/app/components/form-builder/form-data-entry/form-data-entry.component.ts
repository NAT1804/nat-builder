import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDragPlaceholder,
  CdkDragPreview,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DEFAULT_RESUME_LIST_SECTIONS,
  IResumeData,
  RESUME_SECTION,
  SKILL_LEVEL,
} from '@models/resume.model';
import {
  NG_ZORRO_MODULES,
  NzNotificationService,
} from '@shared/ng-zorro.module';
import { distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-form-data-entry',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...NG_ZORRO_MODULES,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    CdkDragPreview,
    CdkDragPlaceholder,
  ],
  templateUrl: './form-data-entry.component.html',
  styleUrl: './form-data-entry.component.less',
})
export class FormDataEntryComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private notification = inject(NzNotificationService);
  private destroyRef = inject(DestroyRef);

  @Input() initialData?: IResumeData;
  @Output() formDataChange = new EventEmitter<any>();

  readonly listSections = DEFAULT_RESUME_LIST_SECTIONS;
  readonly RESUME_SECTION = RESUME_SECTION;

  resumeForm = this.fb.group({
    personalInfo: this.fb.group({
      jobTitle: [''],
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.email]],
      phone: [''],
      address: [''],
      city: [''],
      country: [''],
      avatar: [''],
    }),
    summary: [''],
    experience: this.fb.array([]),
    education: this.fb.array([]),
    skills: this.fb.array([]),
    projects: this.fb.array([]),
  });

  ngOnInit() {
    this.initializeForm();
    this.resumeForm.valueChanges
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.formDataChange.emit(this.resumeForm.value);
      });
  }

  private initializeForm() {
    if (this.initialData) {
      this.resumeForm.patchValue(this.initialData);
    }

    // Add default experience
    this.addExperience();
    // Add default education
    this.addEducation();
    // Add default skills
    this.addSkill();
    // Add default project
    this.addProject();

    // Initail CV Preview
    this.formDataChange.emit(this.resumeForm.value);
  }

  // Form getters
  get personalInfo() {
    return this.resumeForm.get('personalInfo') as FormGroup;
  }

  get experience() {
    return this.resumeForm.get('experience') as FormArray;
  }

  get education() {
    return this.resumeForm.get('education') as FormArray;
  }

  get skills() {
    return this.resumeForm.get('skills') as FormArray;
  }

  get projects() {
    return this.resumeForm.get('projects') as FormArray;
  }

  // Add methods
  addExperience() {
    const experienceGroup = this.fb.group({
      jobTitle: [''],
      company: [''],
      city: [''],
      startDate: [new Date()],
      endDate: [null as Date | null],
      description: [''],
    });
    this.experience.push(experienceGroup);
  }

  addEducation() {
    const educationGroup = this.fb.group({
      school: [''],
      degree: [''],
      city: [''],
      startDate: [new Date()],
      endDate: [null as Date | null],
    });
    this.education.push(educationGroup);
  }

  addSkill() {
    const skillGroup = this.fb.group({
      name: [''],
      level: [SKILL_LEVEL.NOVICE],
    });
    this.skills.push(skillGroup);
  }

  addProject() {
    const projectGroup = this.fb.group({
      name: [''],
      description: [''],
      city: [''],
      startDate: [new Date()],
      endDate: [null as Date | null],
    });
    this.projects.push(projectGroup);
  }

  // Remove methods
  removeExperience(index: number) {
    this.experience.removeAt(index);
  }

  removeEducation(index: number) {
    this.education.removeAt(index);
  }

  removeSkill(index: number) {
    this.skills.removeAt(index);
  }

  removeProject(index: number) {
    this.projects.removeAt(index);
  }

  // Clear form
  clearForm() {
    this.resumeForm.reset();
    this.experience.clear();
    this.education.clear();
    this.skills.clear();
    this.projects.clear();

    // Re-initialize with default items
    this.initializeForm();

    this.notification.info('Form Cleared', 'All form data has been cleared.');
  }

  // Legacy drag and drop methods (keeping for compatibility)
  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
