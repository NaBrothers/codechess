package com.nabrothers.codechess.core.data;

public abstract class Effect extends CodeObject{
    protected CodeObject owner;

    protected int status;

    protected Effect() {
        super();
    }

    protected Effect(int id, int type) {
        super(id, type);
    }

    public CodeObject getOwner() {
        return owner;
    }

    public void setOwner(CodeObject owner) {
        this.owner = owner;
    }

    abstract protected boolean cast();
}
