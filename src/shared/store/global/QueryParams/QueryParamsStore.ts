import { DEFAULT_SORT } from "@constants/product-sort";
import { QueryParams } from "@model/query-params";
import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { ReadonlyURLSearchParams } from "next/navigation";
import qs from "qs";

type PrivateFields = 
    | '_category'
    | '_query'
    | '_sort'
    | '_minPrice'
    | '_maxPrice'
    | '_page'

export default class QueryParamsStore {
    private _category: QueryParams['category'] = undefined;
    private _query: QueryParams['query'] = undefined;
    private _sort: QueryParams['sort'] = undefined;
    private _minPrice: QueryParams['minPrice'] = undefined;
    private _maxPrice: QueryParams['maxPrice'] = undefined;
    private _page: QueryParams['page'] = undefined;

    constructor(params: URLSearchParams | ReadonlyURLSearchParams) {
        makeObservable<QueryParamsStore, PrivateFields>(this, {
            _category: observable,
            _query: observable,
            _sort: observable,
            _minPrice: observable,
            _maxPrice: observable,
            _page: observable,

            category: computed,
            query: computed,
            sort: computed,
            minPrice: computed,
            maxPrice: computed,
            page: computed,
            
            queryObject: computed,
            queryString: computed,

            mergeQueryParams: action.bound,
            setFromSearchParams: action.bound,            
        });
        this.setFromSearchParams(params);
    }

    get category(): QueryParams['category'] {
        return this._category;
    }

    get query(): QueryParams['query'] {
        return this._query;
    }

    get sort(): QueryParams['sort'] {
        return this._sort;
    }

    get minPrice(): QueryParams['minPrice'] {
        return this._minPrice;
    }   

    get maxPrice(): QueryParams['maxPrice'] {
        return this._maxPrice;
    }

    get page(): QueryParams['page'] {
        return this._page;
    }

    get queryObject(): QueryParams {
        const queryParams: QueryParams = {};

        if(this._category !== undefined && this._category !== null) {
            queryParams.category = this._category;
        }

        if(this._query) {
            queryParams.query = this._query;
        }

        if(this._sort) {
            queryParams.sort = this._sort;
        }

        if(this._minPrice !== undefined && this._minPrice !== null) {
            queryParams.minPrice = this._minPrice;
        }

        if(this._maxPrice !== undefined && this._maxPrice !== null) {
            queryParams.maxPrice = this._maxPrice;
        }

        if(this._page !== undefined && this._page !== null) {
            queryParams.page = this._page;
        }

        return queryParams;
    }

    get queryString(): string {
        const paramsObj = this.queryObject;

        if(paramsObj.sort && paramsObj.sort === DEFAULT_SORT) {
            delete paramsObj.sort;
        }

        if(paramsObj.page && paramsObj.page === 1) {
            delete paramsObj.page;
        }
        
        return qs.stringify(paramsObj, { arrayFormat: "repeat" });
    }
        
    setFromSearchParams(searchParams: URLSearchParams | ReadonlyURLSearchParams | string) {
        const queryString = typeof searchParams === "string"
            ? searchParams
            : searchParams.toString();

        const params: QueryParams = qs.parse(queryString, { ignoreQueryPrefix: true });
        
        runInAction(() => {
            this._category = params.category;

            if(params.query !== undefined && params.query !== null) {
                this._query = params.query.length > 0
                    ? params.query
                    : undefined;
            } else {
                this._query = undefined;
            }
            
            this._sort = params.sort ?? undefined;
            this._minPrice = params.minPrice;
            this._maxPrice = params.maxPrice;
            this._page = params.page;          
        });
    }

    mergeQueryParams(params: QueryParams): void {
        runInAction(() => {
            if(params.category !== undefined) {
                this._category = params.category;
            }

            if(params.query !== undefined && params.query !== null) {
                this._query = params.query.length > 0
                    ? params.query
                    : undefined;
            }

            if(params.sort) {
                this._sort = params.sort;
            }

            if(params.minPrice !== undefined) {
                this._minPrice = params.minPrice;
            }
            
            if (params.maxPrice !== undefined) {
                this._maxPrice = params.maxPrice;
            }

            if (params.page !== undefined) {
                this._page = params.page;
            }
        });
    }
}