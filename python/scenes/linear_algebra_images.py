from manim import *

class VectorImage(Scene):
    def construct(self):
        # Set background color
        self.camera.background_color = "#1e1e2e" # A nice dark theme
        
        # Create a coordinate system
        plane = NumberPlane(
            x_range=[-1, 5, 1],
            y_range=[-1, 4, 1],
            background_line_style={
                "stroke_color": TEAL,
                "stroke_width": 2,
                "stroke_opacity": 0.5
            }
        )
        plane.add_coordinates()
        
        # Create a vector
        vec = Arrow(start=plane.c2p(0,0), end=plane.c2p(3,2), buff=0, color=YELLOW)
        
        # Labels for the vector components
        h_line = DashedLine(start=plane.c2p(0,0), end=plane.c2p(3,0), color=RED)
        v_line = DashedLine(start=plane.c2p(3,0), end=plane.c2p(3,2), color=GREEN)
        
        h_label = Text("3", color=RED, font_size=30).next_to(h_line, DOWN)
        v_label = Text("2", color=GREEN, font_size=30).next_to(v_line, RIGHT)
        
        # Math label for the vector
        vec_label = Text("v = [3, 2]", color=YELLOW, font_size=30).next_to(vec.get_end(), UR, buff=0.1)

        # Title
        title = Text("Geometric vs Numeric Representation", font_size=40).to_edge(UP)

        # Add everything to screen
        self.add(plane, vec, h_line, v_line, h_label, v_label, vec_label, title)


class LinearCombinationImage(Scene):
    def construct(self):
         # Set background color
        self.camera.background_color = "#1e1e2e"

        # Create a coordinate system
        plane = NumberPlane(
            x_range=[-2, 6, 1],
            y_range=[-2, 5, 1],
            background_line_style={
                "stroke_color": TEAL,
                "stroke_width": 2,
                "stroke_opacity": 0.3
            }
        )
        plane.add_coordinates()

        # Basis vectors
        v = Arrow(start=plane.c2p(0,0), end=plane.c2p(2,1), buff=0, color=BLUE)
        w = Arrow(start=plane.c2p(0,0), end=plane.c2p(1,2), buff=0, color=GREEN)
        
        # Linear Combination: 1.5v + 1.0w
        # Target point: 1.5*(2,1) + 1.0*(1,2) = (3, 1.5) + (1, 2) = (4, 3.5)
        v_scaled = Arrow(start=plane.c2p(0,0), end=plane.c2p(3,1.5), buff=0, color=BLUE_B)
        w_scaled = Arrow(start=plane.c2p(3,1.5), end=plane.c2p(4,3.5), buff=0, color=GREEN_B)
        
        result_vec = Arrow(start=plane.c2p(0,0), end=plane.c2p(4,3.5), buff=0, color=YELLOW)

        # Labels
        v_label = Text("v", color=BLUE, font_size=30).next_to(v.get_end(), DOWN)
        w_label = Text("w", color=GREEN, font_size=30).next_to(w.get_end(), LEFT)
        
        v_scaled_label = Text("1.5v", color=BLUE_B, font_size=30).next_to(v_scaled.get_center(), DOWN)
        w_scaled_label = Text("1.0w", color=GREEN_B, font_size=30).next_to(w_scaled.get_center(), RIGHT)

        result_label = Text("1.5v + 1.0w", color=YELLOW, font_size=30).next_to(result_vec.get_end(), UR)
        
        # Title
        title = Text("Linear Combinations taking us anywhere on the Span", font_size=36).to_edge(UP)
        title.add_background_rectangle()

        # Add to screen
        self.add(plane, v, w, v_label, w_label, v_scaled, w_scaled, v_scaled_label, w_scaled_label, result_vec, result_label, title)
