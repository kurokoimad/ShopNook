import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

  breadcrumbs: Breadcrumb[] = [];
  predefinedCategories = [
    {
      name: 'Electronics',
      subCategories: [
        { id: 6, name: 'Smartphones' },
        { id: 7, name: 'Accessories' },
        { id: 8, name: 'Camera and photo' },
        { id: 9, name: 'Music Production' },
        { id: 1, name: 'Iphone Cases' },
      ]
    },
    {
      name: 'Sports & Outdoors',
      subCategories: [
        { id: 12, name: 'Outdoor' },
        { id: 13, name: 'Fitness' },
        { id: 2 , name: 'Gym Bottles'}
      ]
    },
    {
      name: 'Home & Decor',
      subCategories: [
        { id: 15, name: 'Fourniture' },
        { id: 16, name: 'Decor' },
        { id: 3, name: 'Vases' }
      ]
    },
    {
      name: 'Women',
      subCategories: [
        { id: 24, name: 'Pants' },
        { id: 25, name: 'Shirts' },
        { id: 4, name: 'Purses' },
        { id: 26, name: 'Shoes' },
      ]
    },
    {
      name: 'Men',
      subCategories: [
        { id: 27, name: 'Pants' },
        { id: 28, name: 'Shirts' },
        { id: 29, name: 'Shoes' }
      ]
    },
    {
      name: 'Kids',
      subCategories: [
        { id: 30, name: 'Pants' },
        { id: 31, name: 'Shirts' },
        { id: 32, name: 'Shoes' }
      ]
    }
  ];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      distinctUntilChanged(),
      map(() => this.buildBreadCrumb(this.activatedRoute.root))
    ).subscribe((breadcrumbs: Breadcrumb[]) => {
      this.breadcrumbs = breadcrumbs;
    });
  }

  ngOnInit(): void {}

  // Build breadcrumb structure based on route and predefined categories
  buildBreadCrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
    const routeConfig = route.routeConfig;
    let label = routeConfig?.data ? routeConfig.data['breadcrumb'] : 'Home';
    const path = routeConfig?.path;
  
    // Handle dynamic route parameters
    const lastRoutePart = path?.split('/').pop();
    const isDynamicRoute = lastRoutePart?.startsWith(':');
    if (isDynamicRoute && route.snapshot) {
      const paramName = lastRoutePart?.split(':')[1];
      path && (path.replace(lastRoutePart!, route.snapshot.params[paramName!]));
      label = route.snapshot.params[paramName!];
  
      // Map dynamic IDs to category names and include parent categories
      if (paramName === 'id') {
        const categoryId = route.snapshot.params[paramName];
        const categoryPath = this.getCategoryPathById(categoryId);
        breadcrumbs = [...breadcrumbs, ...categoryPath];
        label = categoryPath.length ? categoryPath[categoryPath.length - 1].label : 'Unknown Category';
      }
    }
  
    const nextUrl = path ? `${url}/${path}` : url;
  
    const breadcrumb: Breadcrumb = {
      label: label,
      url: nextUrl
    };
  
    const newBreadcrumbs = breadcrumb.label ? [...breadcrumbs, breadcrumb] : [...breadcrumbs];
  
    if (route.firstChild) {
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    
    return newBreadcrumbs;
  }
  

  // Function to get category name by ID from predefined categories
 // Function to get the breadcrumb path by category ID
getCategoryPathById(id: string): Breadcrumb[] {
  let breadcrumbs: Breadcrumb[] = [];
  
  for (const category of this.predefinedCategories) {
    const path = this.findCategoryPath(category, id);
    if (path.length > 0) {
      breadcrumbs = path.map(cat => ({
        label: cat.name,
        url: '' // You can customize the URL here if needed
      }));
      break;
    }
  }
  
  return breadcrumbs;
}

// Recursive function to find the full path to a category by ID
findCategoryPath(category: any, id: string, path: any[] = []): any[] {
  path.push(category);
  
  if (category.subCategories) {
    for (const sub of category.subCategories) {
      if (sub.id.toString() === id) {
        path.push(sub);
        return path;
      } else if (sub.subCategories) {
        const subPath = this.findCategoryPath(sub, id, [...path]);
        if (subPath.length) {
          return subPath;
        }
      }
    }
  }
  
  return [];
}

  // Recursive function to find sub-category by ID
  findSubCategoryById(category: any, id: string): any {
    const subCategory = category.subCategories.find((sub: any) => sub.id.toString() === id);
    if (subCategory) {
      return subCategory;
    }
    for (const sub of category.subCategories) {
      if (sub.subCategories) {
        const found = this.findSubCategoryById(sub, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
}
