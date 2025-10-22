import { DEFAULT_SORT } from "@constants/product-sort";
import { QueryParams } from "@model/query-params";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { ReadonlyURLSearchParams } from "next/navigation";
import qs from "qs";

type PrivateFields = 
    | '_categories'
    | '_query'
    | '_inStock'
    | '_sort'
    | '_count'
    | '_page'

export default class QueryParamsStore {
    private _page: QueryParams['page'] = undefined;
    private _count: QueryParams['count'] = undefined;
    private _categories: QueryParams['categories'] = undefined;
    private _query: QueryParams['query'] = undefined;
    private _sort: QueryParams['sort'] = undefined;
    private _inStock: QueryParams['inStock'] = undefined;

    constructor(params: URLSearchParams | ReadonlyURLSearchParams) {
        makeObservable<QueryParamsStore, PrivateFields>(this, {
            _categories: observable,
            _query: observable,
            _inStock: observable,
            _sort: observable,
            _count: observable,
            _page: observable,

            categories: computed,
            query: computed,
            inStock: computed,
            sort: computed,
            count: computed,
            page: computed,
            
            queryObject: computed,
            queryString: computed,

            mergeQueryParams: action.bound,
            setFromSearchParams: action.bound,            
        });
        this.setFromSearchParams(params);
    }

    get categories(): QueryParams['categories'] {
        return this._categories;
    }

    get query(): QueryParams['query'] {
        return this._query;
    }

    get sort(): QueryParams['sort'] {
        return this._sort;
    }

    get inStock(): QueryParams['inStock'] {
        return this._inStock;
    }

    get count(): QueryParams['count'] {
        return this._count;
    }   

    get page(): QueryParams['page'] {
        return this._page;
    }

    get queryObject(): QueryParams {
        const queryParams: QueryParams = {};

        if(this._categories) {
            queryParams.categories = this._categories;
        }

        if(this._query) {
            queryParams.query = this._query;
        }

        if(this._inStock) {
            queryParams.inStock = this._inStock;
        }

        if(this._sort) {
            queryParams.sort = this._sort;
        }

        if(this._count) {
            queryParams.count = this._count;
        }

        if(this._page) {
            queryParams.page = this._page;
        }

        return queryParams;
    }

    get queryString(): string {
        const paramsObj = this.queryObject;

        if(paramsObj.page && paramsObj.page === 1) {
            delete paramsObj.page;
        }

        if(paramsObj.sort && paramsObj.sort === DEFAULT_SORT) {
            delete paramsObj.sort;
        }
        
        return qs.stringify(paramsObj, { arrayFormat: "repeat" });
    }
        
    setFromSearchParams(searchParams: URLSearchParams | ReadonlyURLSearchParams | string) {
        const queryString = typeof searchParams === "string"
            ? searchParams
            : searchParams.toString();

        const params: QueryParams = qs.parse(queryString, { ignoreQueryPrefix: true });
        
        runInAction(() => {
            if(params.categories) {
                if(Array.isArray(params.categories)) {
                    this._categories = params.categories.length > 0
                        ? params.categories.map(Number)
                        : undefined;

                } else {
                    const categoryNumber = Number(params.categories);
                    this._categories = !Number.isNaN(categoryNumber)
                        ? [categoryNumber]
                        : undefined;   
                }
            } else {
                this._categories = undefined;
            }

            if(params.query !== undefined && params.query !== null) {
                this._query = params.query.length > 0
                    ? params.query
                    : undefined;
            } else {
                this._query = undefined;
            }

            
            this._sort = params.sort  ?? undefined;
            this._inStock = params.inStock ?? undefined;
            this._count = params.count ?? undefined;
            this._page = params.page ?? undefined;            
        });
    }

    mergeQueryParams(params: QueryParams): void {
        runInAction(() => {
            if(params.categories) {
                if(Array.isArray(params.categories)) {
                    this._categories = params.categories.length > 0
                        ? params.categories.map(Number)
                        : undefined;

                } else {
                    const categoryNumber = Number(params.categories);
                    this._categories = !Number.isNaN(categoryNumber)
                        ? [categoryNumber]
                        : undefined;   
                }
            }

            if(params.query !== undefined && params.query !== null) {
                this._query = params.query.length > 0
                    ? params.query
                    : undefined;
            }

            if(params.sort) {
                this._sort = params.sort;
            }

            if(params.inStock !== undefined) {
                this._inStock = params.inStock ?? undefined;
            }

            if(params.count) {
                this._count = params.count;
            }
            
            if (params.page) {
                this._page = params.page;
            }
        });
    }
}