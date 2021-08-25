package com.nabrothers.codechess.web.dto;

public class HttpResponse<T> {

    public final static String SYSTEM_SUCCESS_CODE = "00";
    public final static String SYSTEM_FAILURE_CODE = "99";

    private String code;
    private String msg;
    private T data;

    public HttpResponse(){
        this.code = SYSTEM_SUCCESS_CODE;
    }

    public HttpResponse(T data){
        this.data = data;
        this.code = SYSTEM_SUCCESS_CODE;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
