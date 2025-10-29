//管理用户数据相关
import { ref } from "vue";
import { loginAPI } from "@/apis/user";
import { defineStore } from "pinia";
import { useCartStore } from "./cartStore";
import { mergeCartAPI } from '@/apis/cart'

export const useUserStore = defineStore('user', () => {
    const cartStore = useCartStore()
    //1.定义管理用户数据的state
    const userInfo = ref({})
    //2.定义获取接口数据的action函数
    const getUserInfo = async ({ account, password }) => {
        const res = await loginAPI({ account, password });
        userInfo.value = res.result
        //合并购物车
        await mergeCartAPI(cartStore.cartList.map(item => {
            return {
                skuId: item.skuId,
                selected: item.selected,
                count: item.count,
            }
        }))
        cartStore.updateNewList()
    }
    // 定义退出登录时 删除信息
    const clearUserInfo = () => {
        userInfo.value = {};
        //执行清除购物车的action函数
        cartStore.clearCart()
    };
    //3.对象格式return
    return {
        userInfo,
        getUserInfo,
        clearUserInfo
    }
}, {
    persist: true
}
)