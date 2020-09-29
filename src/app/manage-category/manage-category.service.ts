import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Category } from './category.model';
import { Subject } from 'rxjs';

const BACKEND_URL=environment.apiUrl + "/category";


@Injectable({
  providedIn: 'root'
})
export class ManageCategoryService {
  private categories:Category[]=[];
  private categoriesUpdated=new Subject<{categories:Category[], categoryCount:number}>();
  constructor(private http:HttpClient, private router:Router) { }

  getCategories(categoryPerPage:number, currentPage:number)
  {
    const queryParams=`?pagesize=${categoryPerPage}&page=${currentPage}`;
    this.http
    .get<{ message:string; categories:any; maxCategories:number }>(
      BACKEND_URL + queryParams
    )
    .pipe(
      map(categoryData=>{
       return {
        categories:categoryData.categories.map(category=>{
          return{
            id:category._id,
            name:category.name,
            description:category.description,
            status:category.status
           };
        }), maxCategories:categoryData.maxCategories};
      }))
      .subscribe(transformedCategoryData=>{
        // console.log(transformedProductData);
        this.categories=transformedCategoryData.categories;
        this.categoriesUpdated.next({
          categories:[...this.categories],
          categoryCount:transformedCategoryData.maxCategories
        });
      });
  }

  getselectedcategory()
  {
    // const queryParams=`?pagesize=${categoryPerPage}&page=${currentPage}`;
    this.http
    .get<{ message:string; categories:any; maxCategories:number }>(
      BACKEND_URL + "/selectedcat"
    )
    .pipe(
      map(categoryData=>{
       return {
        categories:categoryData.categories.map(category=>{
          return{
            id:category.cat_id,
            name:category.name,
            description:category.description,
            status:category.status
           };
        }), maxCategories:categoryData.maxCategories};
      }))
      .subscribe(transformedCategoryData=>{
        // console.log(transformedProductData);
        this.categories=transformedCategoryData.categories;
        this.categoriesUpdated.next({
          categories:[...this.categories],
          categoryCount:transformedCategoryData.maxCategories
        });
      });
  }

  Insert(categoryData)
  {
     return this.http.post(BACKEND_URL, categoryData);
  }

  Update(categoryData)
  {
     return this.http.put(BACKEND_URL+"/"+categoryData.id, categoryData);
  }

  getCategoryUpdateListener() {
    return this.categoriesUpdated.asObservable();
  }

  deleteCategory(productId: number) {
    return this.http
    .delete(BACKEND_URL + "/"+productId);
  }

  filterCategories(data)
  {
    return this.http
    .post<{ message:string; categories:any; maxCategories:number }>(
      BACKEND_URL+"/findcat",data
    );

  }
}
