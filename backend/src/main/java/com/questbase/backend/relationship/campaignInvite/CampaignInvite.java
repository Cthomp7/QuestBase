package com.questbase.backend.relationship.campaignInvite;

import java.time.LocalDateTime;

import com.questbase.backend.campaign.Campaign;
import com.questbase.backend.relationship.campaignInvite.enums.CampaignInviteStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "campaign_invites")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CampaignInvite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "campaign_id", nullable = false)
    private Campaign campaign;

    @Column(nullable = false)
    private String email;

    @Column(name = "token_hash", nullable = false, unique = true)
    private String tokenHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CampaignInviteStatus status;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    @Column(
        name = "created_at",
        nullable = false,
        insertable = false,
        updatable = false
    )
    private LocalDateTime createdAt;
}
