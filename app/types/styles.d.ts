declare module '*.scss' {
  const content: Styles;
  export = content;
}

type Styles = {
  [key: string]: any;
};
