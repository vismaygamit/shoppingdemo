import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ManageProductService } from './manage-product.service';
import { Product } from './product.model';
import { Subscription } from 'rxjs';
import {mimeType} from "./mime-type.validator";
import { PageEvent } from '@angular/material/paginator';
import { FormGroup, FormControl,Validators, NgForm } from '@angular/forms';
import { ManageCategoryService } from '../manage-category/manage-category.service';
import { environment } from 'src/environments/environment';
import Swal from "sweetalert2";
import { NgxSpinnerService } from "ngx-spinner";
// import {NgSelectModule} from '@ng-select/ng-select';
// const imageurl=environment.imageUrl;
declare const $: any;
@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css']
})
export class ManageProductComponent implements OnInit {
  form:FormGroup;
  products: Product[] = [];
 isLoading=false;
 totalProducts=0;
 productsPerPage=10;
 pageSizeOptions=[10,15,20];
 currentPage=1;
 imagePreview:string;
 message:string;
 private productsSub: Subscription;
 private categoriesSub:Subscription;
 private mode="create";
 image:string;
 categories:any;
 items=[];
 selected=[];
  // categories: import("g:/shoppingdemo/src/app/manage-category/category.model").Category[];



  constructor(private spinner:NgxSpinnerService,public productService:ManageProductService, public categoryService:ManageCategoryService) { }

  ngOnInit() {
// this.productService.getProducts(2,1);
this.getcategory();
this.getproducts();
this.form=new FormGroup({
  pid:new FormControl(0),
  productname:new FormControl(null, {validators:[Validators.required]}),
txtdesc:new FormControl(null, {validators:[Validators.required]}),
image:new FormControl(null, {validators:[Validators.required], asyncValidators:[mimeType]}),
txtqty:new FormControl(null, {validators:[Validators.required]}),
txtprice:new FormControl(null, {validators:[Validators.required]}),
txtdiscount:new FormControl(null, {validators:[Validators.required]}),
categoryname:new FormControl([0], {validators:[Validators.required]})
});

  }

getproducts()
{
  // this.isLoading=true;
  this.spinner.show();
this.productService.getProducts(this.productsPerPage,this.currentPage)
.subscribe((productData)=>{
  // this.isLoading=false;
  this.spinner.hide();
  this.totalProducts=productData.maxProducts;
  this.products=productData.products;
  // console.log(this.totalProducts);
  // console.log(this.products);

  });
}
  onChangedPage(pageData: PageEvent)
  {

    // console.log(pageData);
    // this.isLoading=true;
    this.spinner.show();
    this.productsPerPage= pageData.pageSize;
    this.currentPage= pageData.pageIndex+1;
    this.productService.getProducts(this.productsPerPage,this.currentPage)
    .subscribe((productData)=>{
      this.isLoading=false;
      this.totalProducts=productData.maxProducts;
      this.products=productData.products;
    // getproducts
    // this.isLoading=false;
    this.spinner.hide();
    });
// console.log(this.postsPerPage);
    // this.
  }

  clear()
  {
    this.form.reset();
  }
  onAddproduct()
  {
    if(this.form.invalid)
    {
      console.log(this.form);
      return;
    }

    const productData=new FormData();
    productData.append("name",this.form.value.productname);
    productData.append("description",this.form.value.txtdesc);
    productData.append("image",this.form.value.image);
    productData.append("quantity", this.form.value.txtqty);
    productData.append('price', this.form.value.txtprice);
    productData.append("discount", this.form.value.txtdiscount);
    productData.append("category_id", this.form.value.categoryname);
    if(this.mode==="create")
    {

      this.productService.Insert(productData).subscribe((data:Product)=>{
        console.log(data);
        Swal.fire(
          'Success!',
          'Product added successfully',
          'success'
        );
        this.getproducts();
        $("#large-Modal").modal('hide');
        this.form.reset();

      });
    }
    else
    {
      productData.append("id",this.form.value.pid);
      this.productService.Update(productData).subscribe(data=>{
        console.log(data);
        Swal.fire(
          'Success!',
          'Product updated successfully',
          'success'
        );
        this.getproducts();
        $("#large-Modal").modal('hide');
        this.form.reset();
      });
    }
  }

  onFilter(form:NgForm)
  {

    // console.log(form.value.search);
  this.spinner.show();

    if(form.value.search)
    {

    // const productData=new FormData();
    let productData={
      "pagesize":this.productsPerPage.toString(),
      "page":this.currentPage.toString(),
      "text":form.value.search
    }
   this.productService.filterProducts(productData)
.subscribe(response=>{
  // this.isLoading=false;
  this.spinner.hide();

  console.log(response);
  // this.getproducts();

  this.totalProducts=response.maxProducts;
  this.products=response.products;

  });
    }
    else
    {
      this.getproducts();
    }
  }



  onImagePicked(event:Event)
  {
    console.log(event);
    const file=(event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});
    this.form.get('image').updateValueAndValidity();
    const reader=new FileReader();
    reader.onload=()=>{
      this.imagePreview=reader.result as string;

    };
    reader.readAsDataURL(file);
    console.log(file);
    //  console.log(this.form);
  }

  getcategory()
  {
    const data=this.categoryService.getselectedcategory();
    this.categoriesSub=this.categoryService
    .getCategoryUpdateListener()
    .subscribe(categoryData=>{
      this.isLoading=false;
      // this.totalcategories=categoryData.categoryCount;
      this.categories=categoryData.categories;
      for(let value of this.categories)
      {
        console.log(value);
        this.items.push({id:value.id,name:value.name});
      }
      // this.selected.push("--Select Category--");
      console.log(this.items);
      });

    console.log(data);
    // subscribe(data=>{
    //   console.log(data);
    // });
  }

  onEdit(value)
  {
    this.mode="edit";
    console.log(value.name);
    $("#large-Modal").modal('show');
    var catid=parseInt(value.category_id);
    console.log(catid);
    this.form.setValue({
      productname:value.name,
      txtdesc:value.description,
      categoryname:[catid],
      txtqty:value.quantity,
      txtprice:value.price,
      image:value.image,
      txtdiscount:value.discount,
      pid:value._id
    });
    console.log(value.product_id);
    this.imagePreview=value.image;
    // this.form.patchValue({image:value.image});
    // this.form.get('image').updateValueAndValidity();
    // const reader=new FileReader();
    // reader.onload=()=>{
    //   this.imagePreview=reader.result as string;

    // };
    // reader.readAsDataURL(value.image);
    // this.onImagePicked(value.image);
    // this.form.reset();
  }
  onDelete(id:number)
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
        this.productService.deleteProduct(id).subscribe(res => {
          // let message:any;
          // console.log(response);
        // this.message=response.message;
          // console.log(this.message);
          Swal.fire(
            'Deleted!',
            'Product deleted successfully',
            'success'
          );
    this.isLoading = true;
    this.getproducts();

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
}
