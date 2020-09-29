import { Injectable } from '@angular/core';
import { Product } from './product.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
const BACKEND_URL=environment.apiUrl + "/product/";

@Injectable({
  providedIn: 'root'
})
export class ManageProductService {
  private products:Product[]=[];
private productsUpdated=new Subject<{products:Product[], productCount:number}>();
  constructor(private http:HttpClient, private router:Router) { }

  getProducts(productPerPage:number, currentPage:number)
  {
    const queryParams=`?pagesize=${productPerPage}&page=${currentPage}`;
   return this.http
    .get<{ message:string; products:any; maxProducts:number }>(
      BACKEND_URL + queryParams
    );
    // .pipe(
    //   map(productData=>{
    //    return {
    //     products:productData.products.map(product=>{
    //       return{
    //         product_id:product._id,
    //         unique_id:product.productunique_id,
    //         name:product.name,
    //         description:product.description,
    //         image:product.image,
    //         quantity:product.quantity,
    //         price:product.price,
    //         category_id:product.category_id,
    //         discount:product.discount,
    //         status:product.status
    //        };
    //     }), maxProducts:productData.maxProducts};
    //   }))
      // .subscribe(transformedProductData=>{
      //   console.log(transformedProductData);
      //   this.products=transformedProductData.products;
      //   this.productsUpdated.next({
      //     products:[...this.products],
      //     productCount:transformedProductData.maxProducts
      //   });
      // });
  }

  addProduct(name: string, description: string, quantity:string, price:string, discount:string, image:File,categoryname:string) {
    // const post: Post = { id: null, title: title, content: content };
    const productData=new FormData();
    productData.append("name",name);
    productData.append("description",description);
    productData.append("image",image);
    productData.append("quantity", quantity);
    productData.append('price', price);
    productData.append("discount", discount);
    productData.append("category_id", categoryname);
    // productData.append("status", status);
    return this.http
      .post<{ message: string, product: Product }>(BACKEND_URL, productData)
      .subscribe(responseData => {
        var result=responseData;
        // return responseData;
        // console.log(responseData.message);
        // const post: Post ={
        //   id:responseData.post.id,
        //    title:title,
        //     content:content,
        //    imagePath:responseData.post.imagePath};
        // const id=responseData.post.id;
        // post.id=id;
        // this.posts.push(post);

        // Swal.fire({
        //   title: 'Success!',
        //   text: responseData.message,
        //   icon: 'success',
        // });
        this.getProductUpdateListener();
        // this.router.navigate(["displayposts"]);

      });
        // console.log(responseData);
      // });

  }

  Insert(productData)
  {
     return this.http.post(BACKEND_URL, productData);
  }

  Update(productData)
  {
     return this.http.put(BACKEND_URL+productData.get('id'), productData);
  }

  filterProducts(data)
  {

    // const queryParams=`?pagesize=${productPerPage}&page=${currentPage}`;
   return this.http
    .post<{ message:string; products:any; maxProducts:number }>(
      BACKEND_URL+"findproduct",data
    );

  }
  // getselectedcategory()
  // {
  //   // const queryParams=`?pagesize=${productPerPage}&page=${currentPage}`;
  //   this.http
  //   .get<{ message:string; category:any; maxCategories:number }>(
  //     environment.apiUrl + "/category/" + "selectedcat"
  //   )
  //   // .pipe(
  //   //   map(categoryData=>{
  //   //    return {
  //   //     categories:categoryData.category.map(category=>{
  //   //       return category;
  //   //     });
  //   //   })
  //   //   )
  //     .subscribe(transformedCategoryData=>{
  //       console.log(transformedCategoryData);
  //       return transformedCategoryData;

  //       // this.products=transformedProductData.products;
  //       // this.productsUpdated.next({
  //       //   products:[...this.products],
  //       //   productCount:transformedProductData.maxProducts
  //       // });
  //     });
  // }

  getProductUpdateListener() {
    return this.productsUpdated.asObservable();
  }

  deleteProduct(productId: number) {
    return this.http
    .delete(BACKEND_URL + productId);
  }
}
