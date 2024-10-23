import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


/** This class automatically catches all errors and any action can be taken
 * based on these error for ex : Redirect to login if status is 401 or display data related
 * error message if status code is : 400
 */
export class HttpErrorInterceptor implements HttpInterceptor {

   static getErrorMessage(error: number){
      if (error === 400){
          return error + ' Bad Request : The request you sent is not correct.';
      } else if (error === 401){
          return  error + ' Unauthorized, please login in order to do this operation.';
      }else if (error === 403){
          return error + ' : You do not have rights to perform this action.';
      }else if (error === 404){
          return error + ' : Unable to find the requested item, not found.';
      }else if (error === 405){
          return error + ' : This operation is not allowed!';
      } else if (error === 500){
          return error + ' : There is an error occurred while completing this request';
      }else if (error === 502){
          return error + ' Bad Gateway : There is an error occurred on server side';
      }else if (error === 503){
          return error + ' Service Unavailable : Requested item is unavailable!';
      }else if (error === 504){
          return error + ' Gateway Timeout : Request is taking too long!';
      } else {
          return  error + ' : An unknown error is occurred!';
      }
  }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
        .pipe(
            catchError((error: HttpErrorResponse) => {
              let errorMsg = '';
              if (error.error instanceof ErrorEvent) {
                console.log('this is client side error');
                errorMsg = `Error: ${error.error.message}`;
              }else {
                console.log('this is server side error');
                errorMsg = HttpErrorInterceptor.getErrorMessage(error.status);
                // we can also show the error message from here
              }
              console.log(errorMsg);
              return throwError(errorMsg);
            })
        );
  }
}
