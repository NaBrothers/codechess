package com.nabrothers.codechess.core.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class BattleResultDTO {
    private List<BattleContextDTO> steps = new ArrayList<>();
}
