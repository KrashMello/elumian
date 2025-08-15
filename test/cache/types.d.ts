type FuncType = (...args: any[]) => any;

type SubArray1 = [{ Auth: any[] }, (arg0: any) => any, (arg0: any, arg1: any) => any, (arg0: any, arg1: any) => any];
type SubArray2 = [() => any, (arg0: any) => any, (arg0: any) => any, (arg0: any) => any, (arg0: any) => any, (arg0: any) => any, (arg0: any) => any];

type MainArray = [SubArray1, SubArray2];
