import React,{Suspense,lazy} from "react";
import {Navigate,useRoutes} from "react-router-dom";
import Layout from '@/layouts'
import Home from '@/views/Home'
import About from '@/views/About'
import Error from '@/views/Error'
import Pomodor from '@/views/Pomodor'
const routes=[
    {
        path:'/',
        // element:<Layout></Layout>,
        // element:<Navigate to='/home'></Navigate>,
        redirect:<Navigate to='/home'></Navigate>
    },
    {
        component:Layout,
        path:'/',
        // element:<Layout></Layout>,
        children:[
            {
                path:'/home',
                // component:Home,
                component:lazy(()=>import('@/views/Home')),
                // element:<Home>/Home>

            },
            {
                path:'/about',
                // component:About,
                component:lazy(()=>import('@/views/About')),
                // element:<About></About>,
                // conponent:lazy(()=>import('@/views/About'))
            },
            {
                path:'/pomodor',
                component:lazy(()=>import('@/views/Pomodor')),
            },
            {
                path:'/*',
                // component:Error,
                component:lazy(()=>import('@/views/Error')),
                // element:<Error></Error>,
                // conponent:lazy(()=>import('@/views/Error'))
            }
        ]
    }
]

// const generateRoutes=(routes:any)=>{
//     const routesRes=routes.map((item:any)=>{
//         console.log('😄item:',item)
//         if(item.children&&item.children.length>0){
//             generateRoutes(item.children)
//         }
//         item.redirect?item.element=item.redirect:
//         item.element=<item.component></item.component>
//         return item;
//     })

//     return routesRes;
// }


// const routesRes=generateRoutes(routes);
// console.log('😃routesRes:',routesRes)

//  function Router(){
//     return useRoutes(routesRes)
//     // const returnRouter= createBrowserRouter(routesRes)
//     // return returnRouter;
// }

const generateRouter = (routers: any) => {
    const rout = routers.map((item: any) => {
        if (item.children) {
            item.children = generateRouter(item.children);
        }
        item.redirect?item.element=item.redirect:
        item.element = <Suspense fallback={<div>加载中</div>}>
            <item.component />
        </Suspense>;

        return item;
    });

    // console.log('😋rout:', rout)
    return rout;

};
    // 生成路由
const Router = () => {
    const routerRes = useRoutes(generateRouter(routes));
    // console.log('😊routerRes:', routerRes);
    return routerRes;
};

export {Router}