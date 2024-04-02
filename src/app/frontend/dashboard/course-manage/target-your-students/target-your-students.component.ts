import { Component, OnInit } from '@angular/core';
import { HttpRequestService } from '../../../../services/http-request.service';
import { FormBuilder, FormControl, Validators, FormArray, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader'; // Import NgxUiLoaderService
import { CustomValidators } from 'ng2-validation';
import { ToasterService } from 'angular2-toaster';
import { CommonService } from '../../../../global/services/common.service';
import { SeoServiceService }  from '../../../../services/seo-service.service';
@Component({
  selector: 'app-target-your-students',
  templateUrl: './target-your-students.component.html',
  styleUrls: ['./target-your-students.component.scss']
})
export class TargetYourStudentsComponent implements OnInit {
  private toasterService: ToasterService;
  myForm: FormGroup;
  questionAnswers: any;
  noOfQuestions: number;
  messages: any = [];
  successMsg: any;
  errorMsg: any;
  i = 0;
  totalAnswer: number=0;;

  constructor(
    toasterService: ToasterService,
    private http: HttpRequestService,
    private fb: FormBuilder,
    private ngxService: NgxUiLoaderService,
    private commonService: CommonService,
    private myRoute: Router,
    public SeoService:SeoServiceService) {
      this.toasterService = toasterService;

  }

  ngOnInit() {
    this.SeoService.getMetaInfo();
    this.createForm();
    this.getTargetYourStudentQuestions();
    window.scrollTo(0,0);
  }

  getTargetYourStudentQuestions() {
        this.ngxService.start();
        this.http.get(`course-target?answer=true&course_id=${ localStorage.getItem('courseEditId')}`).subscribe((response) => {
         // console.log(response);
          if (response['status'] === 'success') {
            this.ngxService.stop();
            this.questionAnswers = response['data'];
            this.noOfQuestions = this.questionAnswers.length;
               const self = this;
            
                this.questionAnswers.forEach(function(entry) {

                
                //  console.log(entry.question);
                  self.addQuestion();
                  self.myForm.get(`question.${self.i}`).patchValue({question: entry.question});
                  self.myForm.get(`question.${self.i}`).patchValue({course_target_id: entry.id});
                  const j = 0;
                
                    entry.course_answer.forEach(function(childrenEntry, j,childLength) {
                    
                    //  console.log(childrenEntry.answer);
                      self.addAnswer(self.i);
                      self.myForm.get(
                        `question.${self.i}.answers.${j}`
                      ).patchValue({answer_id: childrenEntry.id, answer: childrenEntry.answer});

                        j++;
                      //  console.log(j++);

                    });

                    self.i++;
                });
          }
        }, (errors) => {
          // console.log(errors);
          this.ngxService.stop();
          
         });
  }

  createForm() {
    this.myForm = this.fb.group({
      question: this.fb.array([this.createQuestionArray()])
    });

  }

  createQuestionArray() {
    return this.fb.group({
      question: [{value: '', disabled: true}],
      course_target_id: null,
      answers: new FormArray([
        this.createAnswersArray()
      ])
    });
  }

  getQuestion(form) {
    return form.controls.question.controls;
  }

  getAnswer(form) {
    return form.controls.answers.controls;
  }

  createAnswersArray() {
    return this.fb.group({
      answer_id: null,
      answer: null
    });
  }

  addQuestion() {
    const control = <FormArray>this.myForm.get('question');
    control.push(this.createQuestionArray());
  }

  addAnswer(i) {
   // const control = <FormArray>this.myForm.get('question').controls[i].get('answers');
    const control = this.myForm.get(`question.${i}.answers`) as FormArray;

    // console.log(control);
    control.push(this.createAnswersArray());
  }

  removeAnswer(i:number,j: number) {
    // remove address from the list
    const control = this.myForm.get(`question.${i}.answers`) as FormArray;
    control.removeAt(j);
}

  submit() {
    const form_data = this.myForm.value;

  

    form_data['course_id'] = localStorage.getItem('courseEditId');
  //  console.log(form_data);
   this.totalAnswer=0;
    form_data.question.forEach((questions) => {

   //   this.totalAnswer += questions.answers.length;
     // console.log(questions.answers);

    questions.answers.forEach ((answers)=> {
     // console.log(answers.answer);
      if(answers.answer) {
       // console.log(answers.answer);
        this.totalAnswer += questions.answers.length;
      }
    })
     
    });
    
    // console.log(this.totalAnswer);
   // console.log(this.noOfQuestions);

  // console.log(this.totalAnswer-(this.noOfQuestions+1));

    if(this.totalAnswer>0)
    {

        this.ngxService.start();

        this.http.put(`course-target-answer/${localStorage.getItem('courseEditId')}?bulk=true`, form_data).subscribe((response) => {
          this.ngxService.stop();
          if (response['status'] === 'success') {
          //  this.messages = response['status'];
          // this.successMsg = 'Updated successfully';
          // this.errorMsg = false;
            window.scrollTo(0,0);
            this.toasterService.pop('success', 'Updated successfully');
            this.myRoute.navigate(['/dashboard/course-edit/curriculum']);

          }

        }, (errors) => {
        // console.log(errors);
        this.ngxService.stop();
        //  this.messages = errors;
        //  this.successMsg = '';
        //  this.errorMsg = true;
        // this.toasterService.pop('error', 'Error', errors.message);
        this.commonService.showErrors(errors);
          window.scrollTo(0,0);
        });

      } else {
        this.toasterService.pop('error', 'Error', '\atleast one answer required');
      }


    } 

}
