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
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
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
  SKILL_LEVEL_OPTIONS,
} from '@models/resume.model';
import {
  NG_ZORRO_MODULES,
  NzNotificationService,
} from '@shared/ng-zorro.module';
import { distinctUntilChanged } from 'rxjs';
import {
  ArrayFormSectionComponent,
  ArraySectionConfig,
} from './components/array-form-section/array-form-section.component';
import { PersonalInfoFormComponent } from './components/personal-info-form/personal-info-form.component';
import { SummaryFormComponent } from './components/summary-form/summary-form.component';

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
    PersonalInfoFormComponent,
    SummaryFormComponent,
    ArrayFormSectionComponent,
  ],
  templateUrl: './form-data-entry.component.html',
  styleUrl: './form-data-entry.component.less',
})
export class FormDataEntryComponent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private notification = inject(NzNotificationService);
  private destroyRef = inject(DestroyRef);

  @Input() initialData?: IResumeData;
  @Input() listSections?: any;
  @Output() formDataChange = new EventEmitter<any>();
  @Output() listSectionsChange = new EventEmitter<any>();

  readonly skillLevelOptions = SKILL_LEVEL_OPTIONS;
  readonly RESUME_SECTION = RESUME_SECTION;

  // Section configurations
  readonly experienceConfig: ArraySectionConfig = {
    title: 'Experience',
    addButtonText: 'Add Experience',
    fields: [
      {
        name: 'jobTitle',
        label: 'Job title',
        type: 'text',
        placeholder: 'Job title',
      },
      {
        name: 'company',
        label: 'Company',
        type: 'text',
        placeholder: 'Company name',
      },
      { name: 'startDate', label: 'Start & End Date', type: 'date-range' },
      { name: 'description', label: 'Description', type: 'rich-text' },
    ],
  };

  readonly educationConfig: ArraySectionConfig = {
    title: 'Education',
    addButtonText: 'Add Education',
    fields: [
      {
        name: 'school',
        label: 'School',
        type: 'text',
        placeholder: 'e.g., University of California, Los Angeles',
      },
      {
        name: 'degree',
        label: 'Degree',
        type: 'text',
        placeholder: 'e.g., Bachelor of Science, Master of Science',
      },
      { name: 'startDate', label: 'Start & End Date', type: 'date-range' },
      {
        name: 'city',
        label: 'City',
        type: 'text',
        placeholder: 'e.g., Los Angeles',
      },
      { name: 'description', label: 'Description', type: 'rich-text' },
    ],
  };

  readonly skillsConfig: ArraySectionConfig = {
    title: 'Skills',
    addButtonText: 'Add Skill',
    fields: [
      {
        name: 'name',
        label: 'Skill Name',
        type: 'text',
        placeholder: 'e.g., JavaScript, React',
      },
      {
        name: 'level',
        label: 'Level',
        type: 'radio',
        options: SKILL_LEVEL_OPTIONS,
      },
    ],
  };

  readonly projectsConfig: ArraySectionConfig = {
    title: 'Projects',
    addButtonText: 'Add Project',
    fields: [
      {
        name: 'name',
        label: 'Project Name',
        type: 'text',
        placeholder: 'Project name',
      },
      {
        name: 'city',
        label: 'City',
        type: 'text',
        placeholder: 'e.g., Los Angeles',
      },
      { name: 'startDate', label: 'Start & End Date', type: 'date-range' },
      { name: 'description', label: 'Description', type: 'rich-text' },
    ],
  };

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

  get summaryFormGroup() {
    return this.resumeForm;
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
      startDate: [null],
      endDate: [null],
      description: [''],
    });
    this.experience.push(experienceGroup);
  }

  addEducation() {
    const educationGroup = this.fb.group({
      school: [''],
      degree: [''],
      city: [''],
      startDate: [null],
      endDate: [null],
      description: [''],
    });
    this.education.push(educationGroup);
  }

  addSkill() {
    const skillGroup = this.fb.group({
      name: [''],
      level: [SKILL_LEVEL.SKILLFUL],
    });
    this.skills.push(skillGroup);
  }

  addProject() {
    const projectGroup = this.fb.group({
      name: [''],
      description: [''],
      city: [''],
      startDate: [null],
      endDate: [null],
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
    this.listSectionsChange.emit(this.listSections);
  }
}
