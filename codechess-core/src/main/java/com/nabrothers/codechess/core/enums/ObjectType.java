package com.nabrothers.codechess.core.enums;

public enum ObjectType {
    FLOOR(0), WALL(1), PLAYER(2), ATTACK(3), FLYER(4);

    private int code;

    ObjectType(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

    public static ObjectType getByCode(int code) {
        for (ObjectType objectType : ObjectType.values()) {
            if (objectType.getCode() == code) {
                return objectType;
            }
        }
        return null;
    }
}