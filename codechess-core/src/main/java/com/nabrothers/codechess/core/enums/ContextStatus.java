package com.nabrothers.codechess.core.enums;

public enum ContextStatus {
    CREATE(0), START(1), FINISH(2);

    private int code;

    ContextStatus(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static ContextStatus getByCode(int code) {
        for (ContextStatus contextStatus : ContextStatus.values()) {
            if (contextStatus.getCode() == code) {
                return contextStatus;
            }
        }
        return null;
    }
}