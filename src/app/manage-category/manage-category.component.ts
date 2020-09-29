import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Category } from './category.model';
import { Subscription } from 'rxjs';
import { ManageCategoryService } from './manage-category.service';
import { FormGroup, FormControl, Validators, NgForm } from '@angular/forms';
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";


declare var $:any;
@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.css']
})
export class ManageCategoryComponent implements OnInit {
  // currentPage:number;
  // pageCount:number;
  form:FormGroup;
  categories: Category[] = [];
  isLoading=false;
  totalcategories=0;
  categoriesPerPage=10;
  pageSizeOptions=[10,15,20];
  currentPage=1;
  mode="create";
  private categoriesSub: Subscription;
  constructor(private spinner:NgxSpinnerService,public categoryService:ManageCategoryService) { }

  ngOnInit(): void {
    this.getCategory();
    this.form=new FormGroup({
      cid:new FormControl(0),
      categoryname:new FormControl(null, {validators:[Validators.required]}),
    txtdesc:new FormControl(null, {validators:[Validators.required]}),
    });
    // this.isLoading=true;


  }


  getCategory()
  {
    this.spinner.show();
    this.categoryService.getCategories(this.categoriesPerPage,this.currentPage);
    this.categoriesSub=this.categoryService
    .getCategoryUpdateListener()
    .subscribe((categoryData:{categories:Category[];categoryCount:number})=>{
      // this.isLoading=false;
      this.spinner.hide();
      this.totalcategories=categoryData.categoryCount;
      this.categories=categoryData.categories;
      // console.log(categoryData);
      });
  }
  onChangedPage(pageData: PageEvent)
  {

    // console.log(pageData);
    // this.isLoading=true;
    this.spinner.show();
    this.categoriesPerPage= pageData.pageSize;
    this.currentPage= pageData.pageIndex+1;
    this.categoryService.getCategories(this.categoriesPerPage,this.currentPage);
    // this.isLoading=false;
    this.spinner.hide();

// console.log(this.postsPerPage);
    // this.
  }

  onAddcategory()
  {
    if(this.form.invalid)
    {
      console.log(this.form);
      return;
    }

    let model={
      'name':this.form.value.categoryname,
      'description':this.form.value.txtdesc
    };

    if(this.mode==="create")
    {
      console.log("inside add");
      this.categoryService.Insert(model).subscribe(data=>{
        console.log(data);
        Swal.fire(
          'Success!',
          'Category added successfully',
          'success'
        );
        this.getCategory();
        $("#large-Modal").modal('hide');
        this.form.reset();

      });
    }
    else
    {
      // this.model={
      //   'description':this.form.value.txtdesc
      // };
      let model={
        'name':this.form.value.categoryname,
        'description':this.form.value.txtdesc,
        'id':this.form.value.cid
      };
      // model.append("id",this.form.value.cid);
      this.categoryService.Update(model).subscribe(data=>{
        console.log(data);
        Swal.fire(
          'Success!',
          'Category updated successfully',
          'success'
        );
        this.getCategory();
        $("#large-Modal").modal('hide');
        this.form.reset();
      });
    }

  }

  clear()
  {
    this.form.reset();
  }

  onDelete(id)
  {
    Swal.fire({
      title: 'Are you sure want to delete?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        this.categoryService.deleteCategory(id).subscribe(res => {
          // let message:any;
          // console.log(response);
        // this.message=response.message;
          // console.log(this.message);
          Swal.fire(
            'Deleted!',
            'Product deleted successfully',
            'success'
          );
    // this.isLoading = true;
    this.getCategory();

        });
      }
      else if(result.dismiss === Swal.DismissReason.cancel)
      {
        Swal.fire(
          'Cancelled',
          'Cancelled',
          'error'
        )
    // this.postsService.getPosts(this.postsPerPage, this.currentPage);

      }
    });

    // console.log("uniq id"+id);

  }

  onEdit(value)
  {
    this.mode="edit";
    // console.log(value.name);
    $("#large-Modal").modal('show');
    // console.log(catid);
    this.form.setValue({
      categoryname:value.name,
      txtdesc:value.description,
      cid:value.id
    });
    // console.log(value.product_id);
    // this.imagePreview=value.image;
  }

  onFilter(form:NgForm)
  {

    // console.log(form.value.search);
  this.spinner.show();

    if(form.value.search)
    {

    // const productData=new FormData();
    let categoryData={
      "pagesize":this.categoriesPerPage.toString(),
      "page":this.currentPage.toString(),
      "text":form.value.search
    }
   this.categoryService.filterCategories(categoryData)
.subscribe(response=>{
  // this.isLoading=false;
  this.spinner.hide();

  console.log(response);
  // this.getproducts();

  this.totalcategories=response.maxCategories;
  this.categories=response.categories;

  });
    }
    else
    {
      this.getCategory();
    }
  }

}


