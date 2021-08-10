package com.nabrothers.codechess.core.data;

import lombok.Data;

@Data
public abstract class CodeObject {
    protected int id;
    protected int X;
    protected int Y;
    protected int type;

    protected CodeObject() {

    }

    protected CodeObject(int id, int type) {
        this.id = id;
        this.type = type;
    }
}
