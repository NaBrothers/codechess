package com.nabrothers.codechess.core.data;

public abstract class Entity extends CodeObject{
    protected Entity() {
        super();
    }

    protected Entity(int id, int type) {
        super(id, type);
    }
}
