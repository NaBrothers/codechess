package com.nabrothers.codechess.core.dto;

import com.nabrothers.codechess.core.data.Player;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class BattleContextDTO {
    private int step;
    private Map<Long, Player> players;
}
