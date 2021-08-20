package com.nabrothers.codechess.core.po;

import lombok.Data;

@Data
public class BattleRecordPO {
    private Integer id;
    private Integer status;
    private Long updateTime;
    private String result;
    private Long winner;
}
