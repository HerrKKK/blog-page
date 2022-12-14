import myAxios from "@/apis/axios";
import type {ContentInput, ContentOutput, ResourcePreview, ResourceSearch} from "@/types/schemas/resource";
import type {AxiosResponse} from "axios";

export const postContentAPI = (data: ContentInput,
                               success: Function,
                               failure: Function) => {
    myAxios.request({
        method: 'POST',
        url: '/content',
        data: data
    }).then((res: AxiosResponse<number>) => {
        success(res.data)
    }).catch(() => {
        failure()
    })
}

export const getContentAPI = (content_id: number | string | string[],
                              success: Function,
                              failure: Function) => {
    myAxios.request({
        method: 'GET',
        url: `content/${content_id}`,
    }).then((res: AxiosResponse<ContentOutput>) => {
        success(res.data)
    }).catch(() => {
        failure()
    })
}

export const getContentCountAPI = (data: ResourceSearch,
                                   success: Function,
                                   failure: Function) => {
    let url = '/folder/count/'
    if (data != null) {
        if (data.parent_url != null && data.parent_url.length > 0) {
            if (data.parent_url[0] === '/') {
                data.parent_url = data.parent_url.substring(1)
            }
            url += `${data.parent_url}`
        }
        if (data.category_name != null && data.category_name.length != 0) {
            url += `?category_name=${data.category_name}`
        }
        if (data.tag_name != null && data.tag_name.length != 0) {
            url += `?tag_name=${data.tag_name}`
        }
    }
    myAxios.request({
        method: 'GET',
        url: url,
    }).then((res: AxiosResponse<number>) => {
        success(res.data)
    }).catch(() => {
        failure()
    })
}

export const getContentPreviewAPI = (data: ResourceSearch,
                                     success: Function,
                                     failure: Function) => {
    let url = '/folder/sub_content/'
    if (data != null) {
        if (data.parent_url !== undefined && data.parent_url.length > 0) {
            if (data.parent_url[0] === '/') {
                data.parent_url = data.parent_url.substring(1)
            }
            url += `${data.parent_url}`
        }
        url += '?'
        if (data.tag_name !== undefined && data.tag_name.length != 0) {
            url += `tag_name=${data.tag_name}&`
        }
        if (data.category_name !== undefined && data.category_name.length != 0) {
            url += `category_name=${data.category_name}&`
        }
        if (data.pageIdx !== undefined) {
            url += `page_idx=${data.pageIdx}&`
        }
        if (data.pageSize !== undefined) {
            url += `page_size=${data.pageSize}&`
        }
        url = url.slice(0, -1)
    }

    myAxios.request({
        method: 'GET',
        url: url,
    }).then((res: AxiosResponse<ResourcePreview[]>) => {
        success(res.data)
    }).catch(() => {
        failure()
    })
}

export const modifyContentAPI = (data: ContentInput,
                                 success: Function,
                                 failure: Function) => {
    myAxios.request({
        method: 'PUT',
        url: '/content',
        data: data
    }).then((res: AxiosResponse<ContentOutput>) => {
        success(res.data)
    }).catch(() => {
        failure()
    })
}

export const deleteContentAPI = (content_id: number | string | string[] | undefined,
                                 success: Function,
                                 failure: Function) => {
    myAxios.request({
        method: 'DELETE',
        url: `/content/${content_id}`,
    }).then((res: AxiosResponse<number>) => {
        success(res.data)
    }).catch(() => {
        failure()
    })
}
