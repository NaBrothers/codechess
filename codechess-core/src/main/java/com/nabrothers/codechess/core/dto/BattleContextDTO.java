package com.nabrothers.codechess.core.dto;

import com.nabrothers.codechess.core.data.Player;
import lombok.Data;

import java.util.List;

@Data
public class BattleContextDTO {
    private int step;
    private List<Player> players;
}
