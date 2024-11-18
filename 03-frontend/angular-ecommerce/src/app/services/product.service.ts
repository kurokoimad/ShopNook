import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../utilities/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../utilities/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = environment.shopnookApiUrl + '/products';

  private categoryUrl = environment.shopnookApiUrl + '/product-category';

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]> {
    // building the url based on the category id
    const resultUrl = `${this.apiUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(resultUrl);

  }

  getProductListPaginated(myPage: number, myPageSize: number, theCategoryId: number): Observable<GetProductsResponse> {

    // building the url based on page, size and the category id
    const resultUrl = `${this.apiUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${myPage}&size=${myPageSize}`;

    console.log(`retrieving products from: ${resultUrl}`);
    return this.httpClient.get<GetProductsResponse>(resultUrl);

  }

  getAllProductsPaginated(myPage: number, myPageSize: number): Observable<GetProductsResponse> {
    // Building the URL without filtering by category
    const resultUrl = `${this.apiUrl}?page=${myPage}&size=${myPageSize}`;
  
    console.log(`Retrieving all products from: ${resultUrl}`);
    return this.httpClient.get<GetProductsResponse>(resultUrl);
  }

  searchProducts(myKeyword: string): Observable<Product[]> {

    // building the url based on the given keyword
    const searchUrl = `${this.apiUrl}/search/findByNameContaining?name=${myKeyword}`;
    return this.getProducts(searchUrl);
  }

  searchProductsPaginated(myPage: number, myPageSize: number, keyword: string): Observable<GetProductsResponse> {

    // building the url based on keyword, page and size
    const resultUrl = `${this.apiUrl}/search/findByNameContaining?name=${keyword}`
      + `&page=${myPage}&size=${myPageSize}`;

    return this.httpClient.get<GetProductsResponse>(resultUrl);

  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetProductsResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(myProductId: number): Observable<Product> {
    const urlOfTheProduct = `${this.apiUrl}/${myProductId}`;
    return this.httpClient.get<Product>(urlOfTheProduct);
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetProductCategoryResponse>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }
}

interface GetProductsResponse {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetProductCategoryResponse {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
