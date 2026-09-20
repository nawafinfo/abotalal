package com.abotalal.app;

import android.graphics.drawable.GradientDrawable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

public class ServiceAdapter extends RecyclerView.Adapter<ServiceAdapter.Holder> {
    public interface OnClick { void onService(ServiceItem item); }
    private final List<ServiceItem> items;
    private final OnClick onClick;

    public ServiceAdapter(List<ServiceItem> items, OnClick onClick) {
        this.items = items;
        this.onClick = onClick;
    }

    @NonNull @Override public Holder onCreateViewHolder(@NonNull ViewGroup parent, int type) {
        return new Holder(LayoutInflater.from(parent.getContext()).inflate(R.layout.item_service, parent, false));
    }

    @Override public void onBindViewHolder(@NonNull Holder holder, int position) {
        ServiceItem item = items.get(position);
        holder.title.setText(item.title);
        holder.description.setText(item.description);
        GradientDrawable background = new GradientDrawable(GradientDrawable.Orientation.TL_BR,
                new int[]{item.color, 0xFF172554});
        background.setCornerRadius(28f);
        holder.card.setBackground(background);
        holder.itemView.setOnClickListener(v -> onClick.onService(item));
    }

    @Override public int getItemCount() { return items.size(); }

    static class Holder extends RecyclerView.ViewHolder {
        final View card;
        final TextView title;
        final TextView description;
        Holder(@NonNull View view) {
            super(view);
            card = view.findViewById(R.id.serviceCard);
            title = view.findViewById(R.id.serviceTitle);
            description = view.findViewById(R.id.serviceDescription);
        }
    }
}
