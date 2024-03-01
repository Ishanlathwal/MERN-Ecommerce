import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
export const productApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api/v1/",

    credentials: "include",
  }),

  reducerPath: "products",

  endpoints: (build) => ({
    /// with infinite scroll

    getProducts: build.query({
      query: (page) => `products?page=${page}`,
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        currentCache.product.push(...newItems.product);
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),

    ///// without infinite scroll.... sirf keyword = "" because baki sab ki usestate m default value set ho gyi h products.jsx m

    getProductsWithoutInfinite: build.query({
      query: ({ currentPage, keyword = "", price, category, ratings }) => {
        let url = `products?page=${currentPage}&keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}`;

        if (category) {
          url = `products?page=${currentPage}&keyword=${keyword}&price[gte]=${price[0]}&price[lte]=${price[1]}&ratings[gte]=${ratings}&category=${category}`;
        }
        return url;
      },
    }),

    // Products Admin Routes

    getAdminProducts: build.query({
      query: () => `admin/products`,
      providesTags: ["admin"],
    }),

    getSingleProduct: build.query({
      query: (id) => `products/${id}`,
      providesTags: ["admin"],
    }),

    createProducts: build.mutation({
      query: (data) => ({
        url: "admin/products/new",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["admin"],
    }),
    updateProducts: build.mutation({
      query: ({ id, data }) => ({
        url: `products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["admin"],
    }),
    deleteAdminProducts: build.mutation({
      query: (id) => ({
        url: `admin/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["admin"],
    }),

    /// Orders Admin Routes
    getAdminOrders: build.query({
      query: () => `admin/orders`,
      providesTags: ["admin/orders"],
    }),

    getSingleOrder: build.query({
      query: (id) => `order/${id}`,
      providesTags: ["admin/single"],
    }),

    updateOrders: build.mutation({
      query: ({ id, data }) => ({
        url: `admin/order/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["admin/orders", "admin/single"],
    }),
    deleteAdminOrders: build.mutation({
      query: (id) => ({
        url: `admin/order/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["admin/orders"],
    }),

    // User Admin Routes
    getAdminAllUsers: build.query({
      query: () => `admin/users`,
      providesTags: ["admin/users"],
    }),

    getSingleUserAdmin: build.query({
      query: (id) => `admin/user/${id}`,
      providesTags: ["admin/user/single"],
    }),
    updateAdminUser: build.mutation({
      query: ({ id, data }) => ({
        url: `admin/user/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["admin/users", "admin/user/single"],
    }),
    deleteAdminUser: build.mutation({
      query: (id) => ({
        url: `admin/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["admin/users", "admin/user/single"],
    }),

    // Reviews Admin routes
    getAllReviewsAdmin: build.query({
      query: (id) => `reviews?id=${id}`,
      providesTags: ["admin/user/reviews"],
    }),

    deleteReviewAdmin: build.mutation({
      query: ({ reviewId, productId }) => ({
        url: `reviews?id=${reviewId}&productId=${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["admin/user/reviews"],
    }),
    // signup: build.mutation({
    //   query: (user) => ({
    //     url: "/register",
    //     method: "POST",
    //     body: user,
    //   }),
    // }),

    // login: build.mutation({
    //   query: (data) => ({
    //     url: "/login",
    //     method: "POST",
    //     body: data,
    //   }),
    //
    // }),
  }),
});
export const {
  useGetProductsQuery,
  useCreateProductsMutation,
  useGetSingleProductQuery,
  useGetProductsWithoutInfiniteQuery,
  useSignupMutation,
  useLoginMutation,
  useGetAdminProductsQuery,
  useDeleteAdminProductsMutation,
  useUpdateProductsMutation,
  useGetAdminOrdersQuery,
  useGetSingleOrderQuery,
  useUpdateOrdersMutation,
  useDeleteAdminOrdersMutation,
  useGetAdminAllUsersQuery,
  useGetSingleUserAdminQuery,
  useDeleteAdminUserMutation,
  useUpdateAdminUserMutation,
  useDeleteReviewAdminMutation,
  useLazyGetAllReviewsAdminQuery,
} = productApi;
