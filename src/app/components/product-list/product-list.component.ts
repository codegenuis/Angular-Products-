import { Component, OnInit } from "@angular/core";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import { ProductService } from "../../core/services/products.service";
import { Product } from "../../core/models/product.model";
import { ProductCardComponent } from "../product-card/product-card.component";
import { CommonModule } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";


// This component is responsible for displaying a list of products
// and allowing the user to filter them by category or search by name
@Component({
    selector: 'app-product-list',
    templateUrl: './product-list.component.html',
    styleUrl: './product-list.component.scss',
    providers: [ProductService, HttpClient],
    imports: [
        ProductCardComponent,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule
    ],
    standalone: true,
})
export class ProductListComponent implements OnInit {
    products: Product[] = [];
    filtered: Product[] = [];
    categories: string[] = [];
    selectedCategory: string = 'All';
    searchControl = new FormControl('');
    isLoading: boolean = true;

    constructor(private productService: ProductService) { }

    ngOnInit() {
        this.productService.getProducts().subscribe(products => {
            this.isLoading = false;
            this.products = products;
            this.filtered = products;
            this.categories = [...new Set(products.map(p => p.category))];
        });

        this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((value) => {
            this.filtered = this.products.filter(p =>
                p.name?.toLowerCase().includes((value ?? '').toLowerCase())
            );
        });
    }

    filterByCategory(category: string) {
        this.selectedCategory = category;
        this.filtered = [...this.products];
        if (category !== 'All') {
            this.filtered = this.products.filter(p => p.category === category);
        }
    }
}