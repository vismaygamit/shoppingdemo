import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { ErrorComponent } from './error/error.component';
import { throwError } from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ErrorService} from './error/error.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor{
  constructor(private dialog:MatDialog, private errorService: ErrorService){}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error:HttpErrorResponse)=>{
        let errorMessage="An unknoen error occured";
        if(error.error.message)
        {
          errorMessage=error.error.message;
        }
        this.dialog.open(ErrorComponent, {data:{message:errorMessage}});
      // throw new Error("Method not implemented.");
        return throwError(error);
      })
    );
  }

}
