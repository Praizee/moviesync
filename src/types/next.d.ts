import "next";

declare module "next" {
  export type PageProps<
    P = Record<string, string>,
    S = Record<string, string | string[] | undefined>
  > = {
    params: P;
    searchParams: S;
  };
}

// import "next";

// declare module "next" {
//   interface PageProps {
//     params?: Record<string, string>;
//     searchParams?: Record<string, string | string[] | undefined>;
//   }
// }

